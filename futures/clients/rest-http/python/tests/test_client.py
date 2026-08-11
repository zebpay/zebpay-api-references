import hashlib
import hmac
import json
import unittest
from unittest.mock import Mock
from urllib.parse import urlencode

from client.client import FuturesApiClient
from utils.auth import AuthUtils


class FuturesApiClientTest(unittest.TestCase):
    def setUp(self):
        self.client = FuturesApiClient(
            api_key='test-api-key',
            secret_key='test-secret'
        )
        response = Mock()
        response.raise_for_status.return_value = None
        response.json.return_value = {'ok': True}
        self.client.http_session.request = Mock(return_value=response)

    @staticmethod
    def sign(value):
        return hmac.new(
            b'test-secret',
            value.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

    def request_kwargs(self):
        return self.client.http_session.request.call_args.kwargs

    def test_client_exposes_every_route_in_api_controllers(self):
        methods = [
            'fetch_markets', 'get_order_book', 'get_ticker_24hr',
            'get_market_info', 'get_agg_trade', 'get_klines',
            'get_system_time', 'get_system_status', 'get_trade_fee',
            'get_trade_fees', 'get_exchange_info', 'get_pairs',
            'get_balance', 'create_order', 'cancel_order', 'edit_order',
            'cancel_all_orders', 'get_order', 'add_tpsl_order',
            'add_margin', 'reduce_margin', 'close_position',
            'get_open_orders', 'get_positions', 'get_user_leverage',
            'get_user_leverages', 'update_leverage', 'get_order_history',
            'get_trade_history', 'get_transaction_history'
        ]

        self.assertEqual(len(methods), 30)
        for method in methods:
            self.assertTrue(callable(getattr(self.client, method, None)), method)

    def test_jwt_and_api_key_credentials_are_mutually_exclusive(self):
        with self.assertRaisesRegex(ValueError, 'mutually exclusive'):
            FuturesApiClient(
                jwt='jwt',
                api_key='api-key',
                secret_key='secret'
            )

    def test_public_only_client_requires_auth_for_private_methods(self):
        client = FuturesApiClient()
        response = Mock()
        response.raise_for_status.return_value = None
        response.json.return_value = {'ok': True}
        client.http_session.request = Mock(return_value=response)

        client.get_system_time()
        request = client.http_session.request.call_args.kwargs
        self.assertEqual(request['headers'], {})
        with self.assertRaisesRegex(
            ValueError,
            'Missing authentication credentials',
        ):
            client.get_balance()
        with self.assertRaisesRegex(
            ValueError,
            'Both api_key and secret_key',
        ):
            FuturesApiClient(api_key='incomplete')

    def test_api_key_get_signs_and_transmits_same_query(self):
        self.client._request(
            'GET',
            '/api/v1/trade/positions',
            params={'symbols': ['BTCUSDT', 'ETHUSDT']}
        )

        request = self.request_kwargs()
        self.assertIsInstance(request['params']['timestamp'], int)
        self.assertEqual(
            request['headers']['x-auth-signature'],
            self.sign(urlencode(request['params'], doseq=True))
        )

    def test_api_key_write_signs_and_transmits_same_body(self):
        self.client.cancel_order({
            'clientOrderId': 'order-123',
            'symbol': 'btcusdt'
        })

        request = self.request_kwargs()
        body = json.loads(request['data'])
        self.assertEqual(body['symbol'], 'BTCUSDT')
        self.assertIsInstance(body['timestamp'], int)
        self.assertEqual(
            request['headers']['x-auth-signature'],
            self.sign(request['data'])
        )

    def test_api_key_body_uses_javascript_number_serialization(self):
        self.client._request(
            'POST',
            '/api/v1/trade/addMargin',
            data={'positionId': 'position-123', 'amount': 100.0}
        )

        request = self.request_kwargs()
        serialized = request['data']
        self.assertIn('"amount":100', serialized)
        self.assertNotIn('"amount":100.0', serialized)
        self.assertEqual(
            request['headers']['x-auth-signature'],
            self.sign(serialized)
        )

    def test_api_key_cancel_all_sends_timestamp_body(self):
        self.client.cancel_all_orders()

        request = self.request_kwargs()
        self.assertEqual(list(json.loads(request['data'])), ['timestamp'])
        self.assertEqual(
            request['headers']['x-auth-signature'],
            self.sign(request['data'])
        )

    def test_stop_limit_validation_matches_server_rules(self):
        self.client.create_order({
            'symbol': 'btcusdt',
            'amount': 0.01,
            'side': 'buy',
            'type': 'stop_limit',
            'price': 66000,
            'triggerPrice': 65500
        })

        self.assertEqual(
            json.loads(self.request_kwargs()['data'])['type'],
            'STOP_LIMIT',
        )
        with self.assertRaisesRegex(ValueError, 'price must be >= triggerPrice'):
            self.client.create_order({
                'symbol': 'BTCUSDT',
                'amount': 0.01,
                'side': 'BUY',
                'type': 'STOP_LIMIT',
                'price': 65000,
                'triggerPrice': 65500
            })

    def test_add_tpsl_requires_symbol_and_exactly_one_trigger(self):
        base = {
            'positionId': 'position-123',
            'amount': 0.01,
            'side': 'SELL',
            'symbol': 'BTCUSDT'
        }
        with self.assertRaisesRegex(ValueError, 'Exactly one'):
            self.client.add_tpsl_order({
                **base,
                'stopLossPrice': 62000,
                'takeProfitPrice': 70000
            })
        with self.assertRaisesRegex(ValueError, 'symbol'):
            self.client.add_tpsl_order({
                'positionId': base['positionId'],
                'amount': base['amount'],
                'side': base['side'],
                'stopLossPrice': 62000
            })


if __name__ == '__main__':
    unittest.main()
