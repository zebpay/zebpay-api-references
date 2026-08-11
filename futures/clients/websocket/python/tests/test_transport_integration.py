import asyncio
import hashlib
import hmac
import json
import threading
import unittest

import socketio
from aiohttp import web

from client import FuturesPrivateWebSocketClient, PRIVATE_EVENTS


API_KEY = 'integration-api-key'
SECRET_KEY = 'integration-secret'
JWT = 'integration-jwt'
NAMESPACE = '/auth-stream'


def validate_auth(auth):
    if auth.get('apiKey') == API_KEY:
        payload = {'timestamp': auth.get('timestamp')}
        if auth.get('subaccountId'):
            payload['subaccountId'] = auth['subaccountId']
        serialized = json.dumps(payload, separators=(',', ':'))
        expected = hmac.new(
            SECRET_KEY.encode(),
            serialized.encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(auth.get('signature', ''), expected)
    return (
        auth.get('clientType') == 'api'
        and auth.get('token') == JWT
    )


class SocketIOTestServer:
    def __init__(self):
        self.loop = asyncio.new_event_loop()
        self.ready = threading.Event()
        self.thread = threading.Thread(
            target=self._run,
            name='socketio-integration-server',
            daemon=True,
        )
        self.error = None
        self.port = None
        self.runner = None
        self.server = None
        self.received_auth = []
        self.connected_sids = set()

    def start(self):
        self.thread.start()
        if not self.ready.wait(5):
            raise TimeoutError('Socket.IO test server did not start')
        if self.error:
            raise self.error
        return self

    def stop(self):
        if self.server and self.runner:
            cleanup = asyncio.run_coroutine_threadsafe(
                self._stop_async(),
                self.loop,
            )
            cleanup.result(5)
        self.loop.call_soon_threadsafe(self.loop.stop)
        self.thread.join(5)

    @property
    def base_url(self):
        return f'http://127.0.0.1:{self.port}'

    def _run(self):
        asyncio.set_event_loop(self.loop)
        try:
            self.loop.run_until_complete(self._start_async())
        except Exception as error:
            self.error = error
            self.ready.set()
            return
        self.ready.set()
        self.loop.run_forever()
        pending = asyncio.all_tasks(self.loop)
        for task in pending:
            task.cancel()
        self.loop.run_until_complete(
            asyncio.gather(*pending, return_exceptions=True)
        )
        self.loop.close()

    async def _start_async(self):
        self.server = socketio.AsyncServer(
            async_mode='aiohttp',
            logger=False,
            engineio_logger=False,
        )
        app = web.Application()
        self.server.attach(app)

        @self.server.event(namespace=NAMESPACE)
        async def connect(sid, environ, auth):
            self.connected_sids.add(sid)
            self.received_auth.append(auth)
            asyncio.create_task(
                self._authenticate(self.server, sid, auth)
            )
            return True

        @self.server.event(namespace=NAMESPACE)
        async def disconnect(sid, reason):
            self.connected_sids.discard(sid)

        self.runner = web.AppRunner(app)
        await self.runner.setup()
        site = web.TCPSite(self.runner, '127.0.0.1', 0)
        await site.start()
        self.port = site._server.sockets[0].getsockname()[1]

    async def _stop_async(self):
        for sid in list(self.connected_sids):
            await self.server.disconnect(sid, namespace=NAMESPACE)
        await asyncio.sleep(0)
        await self.server.shutdown()
        await self.runner.cleanup()

    async def _authenticate(self, server, sid, auth):
        await asyncio.sleep(0.01)
        if not validate_auth(auth):
            await server.emit(
                'auth.error',
                {
                    'code': 401,
                    'message': 'invalid integration credentials',
                },
                to=sid,
                namespace=NAMESPACE,
            )
            await server.disconnect(sid, namespace=NAMESPACE)
            return

        await server.emit(
            'auth.ok',
            {
                'accountId': auth.get(
                    'subaccountId',
                    'root-account',
                ),
            },
            to=sid,
            namespace=NAMESPACE,
        )
        for event_name in PRIVATE_EVENTS:
            await server.emit(
                event_name,
                {'eventName': event_name},
                to=sid,
                namespace=NAMESPACE,
            )


class TransportIntegrationTest(unittest.TestCase):
    def setUp(self):
        self.server = SocketIOTestServer().start()

    def tearDown(self):
        self.server.stop()

    def test_api_key_client_receives_all_events_over_websocket(self):
        client = FuturesPrivateWebSocketClient(
            api_key=API_KEY,
            secret_key=SECRET_KEY,
            subaccount_id='456',
            base_url=self.server.base_url,
        )
        received = {}
        all_events = threading.Event()

        for event_name in PRIVATE_EVENTS:
            def handler(payload, name=event_name):
                received[name] = payload
                if len(received) == len(PRIVATE_EVENTS):
                    all_events.set()

            client.on(event_name, handler)

        try:
            client.connect()
            self.assertEqual(
                client.wait_for_auth(),
                {'accountId': '456'},
            )
            self.assertTrue(all_events.wait(3))
            self.assertEqual(len(received), 14)
            for event_name, payload in received.items():
                self.assertEqual(payload['eventName'], event_name)
            self.assertNotIn(
                'secretKey',
                self.server.received_auth[0],
            )
        finally:
            client.disconnect()

    def test_jwt_client_authenticates_over_websocket(self):
        client = FuturesPrivateWebSocketClient(
            token_provider=lambda: JWT,
            base_url=self.server.base_url,
        )
        try:
            client.connect()
            self.assertEqual(
                client.wait_for_auth(),
                {'accountId': 'root-account'},
            )
            self.assertEqual(
                self.server.received_auth[0]['token'],
                JWT,
            )
        finally:
            client.disconnect()

    def test_client_surfaces_application_auth_error(self):
        client = FuturesPrivateWebSocketClient(
            api_key='invalid-api-key',
            secret_key='invalid-secret',
            base_url=self.server.base_url,
        )
        try:
            client.connect()
            with self.assertRaisesRegex(
                ConnectionError,
                'invalid integration credentials',
            ):
                client.wait_for_auth()
        finally:
            client.disconnect()


if __name__ == '__main__':
    unittest.main()
