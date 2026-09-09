import hashlib
import hmac
import unittest

from client import FuturesPrivateWebSocketClient, PRIVATE_EVENTS
from utils.auth import create_api_key_auth


class FakeSocketIO:
    def __init__(self):
        self.handlers = {}
        self.connect_calls = []
        self.disconnect_calls = 0
        self.connected = False

    def on(self, event, handler=None, namespace=None):
        self.handlers[(namespace, event)] = handler
        return handler

    def connect(self, url, **kwargs):
        self.connect_calls.append((url, kwargs))
        self.connected = True

    def disconnect(self):
        self.disconnect_calls += 1
        self.connected = False

    def wait(self):
        return None

    def trigger(self, event, *args, namespace='/auth-stream'):
        return self.handlers[(namespace, event)](*args)


class FuturesPrivateWebSocketClientTest(unittest.TestCase):
    def test_root_and_subaccount_hmac_payloads(self):
        timestamp = 1750000000000
        secret = 'test-secret'
        root = create_api_key_auth(
            'api-key',
            secret,
            timestamp=timestamp,
        )
        subaccount = create_api_key_auth(
            'api-key',
            secret,
            subaccount_id=456,
            timestamp=timestamp,
        )

        def sign(payload):
            return hmac.new(
                secret.encode(),
                payload.encode(),
                hashlib.sha256,
            ).hexdigest()

        self.assertEqual(
            root['signature'],
            sign('{"timestamp":1750000000000}'),
        )
        self.assertEqual(
            subaccount['signature'],
            sign(
                '{"timestamp":1750000000000,'
                '"subaccountId":"456"}'
            ),
        )
        self.assertEqual(subaccount['subaccountId'], '456')

    def test_api_key_connection_generates_fresh_auth(self):
        fake = FakeSocketIO()
        timestamps = iter([1750000000000, 1750000000001])
        client = FuturesPrivateWebSocketClient(
            api_key='api-key',
            secret_key='test-secret',
            socket_client=fake,
            now=lambda: next(timestamps),
        )

        client._connect_once()
        client._connect_once()

        first = fake.connect_calls[0][1]['auth']
        second = fake.connect_calls[1][1]['auth']
        self.assertEqual(
            fake.connect_calls[0][0],
            'https://sp-futuresws.zebpay.com',
        )
        self.assertEqual(
            fake.connect_calls[0][1]['namespaces'],
            ['/auth-stream'],
        )
        self.assertEqual(
            fake.connect_calls[0][1]['transports'],
            ['websocket'],
        )
        self.assertEqual(first['timestamp'], 1750000000000)
        self.assertEqual(second['timestamp'], 1750000000001)
        self.assertNotEqual(first['signature'], second['signature'])

    def test_static_and_provider_jwt_authentication(self):
        static = FuturesPrivateWebSocketClient(
            jwt='static-jwt',
            client_type='ui',
            subaccount_id=456,
            socket_client=FakeSocketIO(),
        )
        self.assertEqual(
            static.build_auth(),
            {
                'clientType': 'ui',
                'token': 'static-jwt',
                'subaccountId': '456',
            },
        )

        tokens = iter(['jwt-1', 'jwt-2'])
        provider = FuturesPrivateWebSocketClient(
            token_provider=lambda: next(tokens),
            socket_client=FakeSocketIO(),
        )
        self.assertEqual(provider.build_auth()['token'], 'jwt-1')
        self.assertEqual(provider.build_auth()['token'], 'jwt-2')

    def test_rejects_ambiguous_authentication(self):
        with self.assertRaisesRegex(ValueError, 'mutually exclusive'):
            FuturesPrivateWebSocketClient(
                jwt='jwt',
                api_key='api-key',
                secret_key='secret',
            )
        with self.assertRaisesRegex(
            ValueError,
            'Both api_key and secret_key',
        ):
            FuturesPrivateWebSocketClient(api_key='api-key')
        with self.assertRaisesRegex(
            ValueError,
            'either jwt or token_provider',
        ):
            FuturesPrivateWebSocketClient(
                jwt='jwt',
                token_provider=lambda: 'jwt',
            )

    def test_relays_all_business_events_and_auth_state(self):
        fake = FakeSocketIO()
        client = FuturesPrivateWebSocketClient(
            jwt='jwt',
            socket_client=fake,
        )
        received = {}
        for event_name in PRIVATE_EVENTS:
            client.on(
                event_name,
                lambda payload, name=event_name: received.setdefault(
                    name,
                    payload,
                ),
            )
            fake.trigger(event_name, {'eventName': event_name})

        self.assertEqual(len(received), 14)
        fake.trigger('auth.ok', {'accountId': '123'})
        self.assertTrue(client.authenticated)
        self.assertEqual(
            client.wait_for_auth(),
            {'accountId': '123'},
        )
        fake.trigger('disconnect', 'transport close')
        self.assertFalse(client.authenticated)

    def test_auth_error_is_returned_by_wait_for_auth(self):
        fake = FakeSocketIO()
        client = FuturesPrivateWebSocketClient(
            jwt='jwt',
            socket_client=fake,
        )
        fake.trigger(
            'auth.error',
            {'code': 403, 'message': 'missing scope'},
        )
        with self.assertRaisesRegex(ConnectionError, 'missing scope'):
            client.wait_for_auth()

    def test_network_disconnect_does_not_reconnect(self):
        fake = FakeSocketIO()
        client = FuturesPrivateWebSocketClient(
            api_key='api-key',
            secret_key='test-secret',
            socket_client=fake,
        )

        client.connect()
        fake.connected = False
        fake.trigger('disconnect', 'transport close')

        self.assertEqual(len(fake.connect_calls), 1)


if __name__ == '__main__':
    unittest.main()
