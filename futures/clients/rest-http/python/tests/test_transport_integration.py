import hashlib
import hmac
import json
import queue
import re
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

from client.client import FuturesApiClient


API_KEY = 'integration-api-key'
SECRET_KEY = 'integration-secret'


class CaptureHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._capture()

    def do_POST(self):
        self._capture()

    def do_DELETE(self):
        self._capture()

    def do_PATCH(self):
        self._capture()

    def _capture(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode()
        self.server.requests.put({
            'method': self.command,
            'path': self.path,
            'headers': self.headers,
            'body': body,
        })
        response = b'{"ok":true}'
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def log_message(self, format, *args):
        return


class TransportIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(
            ('127.0.0.1', 0),
            CaptureHandler,
        )
        cls.server.requests = queue.Queue()
        cls.thread = threading.Thread(
            target=cls.server.serve_forever,
            daemon=True,
        )
        cls.thread.start()
        cls.base_url = (
            f'http://127.0.0.1:{cls.server.server_address[1]}'
        )

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(5)

    @staticmethod
    def sign(value):
        return hmac.new(
            SECRET_KEY.encode(),
            value.encode(),
            hashlib.sha256,
        ).hexdigest()

    def next_request(self):
        return self.server.requests.get(timeout=3)

    def test_api_key_write_transmits_exact_signed_json(self):
        client = FuturesApiClient(
            api_key=API_KEY,
            secret_key=SECRET_KEY,
            base_url=self.base_url,
        )
        client._request(
            'POST',
            '/api/v1/trade/addMargin',
            data={'positionId': 'position-123', 'amount': 100.0},
        )
        request = self.next_request()

        self.assertRegex(
            request['body'],
            re.compile(
                r'^\{"positionId":"position-123","amount":100,'
                r'"timestamp":\d+\}$'
            ),
        )
        self.assertEqual(
            request['headers']['x-auth-signature'],
            self.sign(request['body']),
        )

    def test_api_key_read_transmits_exact_signed_query(self):
        client = FuturesApiClient(
            api_key=API_KEY,
            secret_key=SECRET_KEY,
            base_url=self.base_url,
        )
        client._request(
            'GET',
            '/api/v1/trade/positions',
            params={'symbols': ['BTCUSDT', 'ETHUSDT']},
        )
        request = self.next_request()
        query = urlsplit(request['path']).query

        self.assertRegex(
            query,
            re.compile(
                r'^symbols=BTCUSDT&symbols=ETHUSDT&timestamp=\d+$'
            ),
        )
        self.assertEqual(
            request['headers']['x-auth-signature'],
            self.sign(query),
        )

    def test_jwt_body_uses_normal_json_transport(self):
        client = FuturesApiClient(
            jwt='integration-jwt',
            base_url=self.base_url,
        )
        client._request(
            'POST',
            '/api/v1/trade/addMargin',
            data={'positionId': 'position-123', 'amount': 100.0},
        )
        request = self.next_request()

        self.assertEqual(
            request['headers']['Authorization'],
            'Bearer integration-jwt',
        )
        self.assertEqual(
            json.loads(request['body']),
            {'positionId': 'position-123', 'amount': 100.0},
        )


if __name__ == '__main__':
    unittest.main()
