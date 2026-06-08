import unittest
from unittest.mock import patch, MagicMock
import hmac
import hashlib
import json
import urllib.parse
from zebpay_spot_client import SpotClient, ZebpayAPIError

class TestSpotClient(unittest.TestCase):
    def setUp(self):
        self.api_key = "test_key"
        self.api_secret = "test_secret"
        self.client = SpotClient(api_key=self.api_key, api_secret=self.api_secret)

    def test_constructor_validation(self):
        # Should allow instantiating with no credentials
        public_client = SpotClient()
        with self.assertRaises(ValueError):
            public_client.get_account_balance()
        
        # Should accept JWT
        client_jwt = SpotClient(jwt="test_jwt")
        self.assertEqual(client_jwt.jwt, "test_jwt")

        # Should accept API Key and Secret
        client_keys = SpotClient(api_key="key", api_secret="secret")
        self.assertEqual(client_keys.api_key, "key")
        self.assertEqual(client_keys.api_secret, "secret")

    @patch('requests.Session.request')
    def test_public_endpoint_url(self, mock_request):
        mock_response = MagicMock()
        mock_response.json.return_value = {"status": "success"}
        mock_request.return_value = mock_response

        # 1. Test get_all_tickers
        self.client.get_all_tickers()
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/market/allTickers",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 2. Test get_ticker
        self.client.get_ticker("BTC-INR")
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/market/ticker?symbol=BTC-INR",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 3. Test get_kline (plural: klines)
        self.client.get_kline("BTC-INR", "1d", 1700000000000, 1700000086400)
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/market/klines?symbol=BTC-INR&interval=1d&startTime=1700000000000&endTime=1700000086400",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 4. Test get_orderbook
        self.client.get_orderbook("BTC-INR", limit=10)
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/market/orderbook?symbol=BTC-INR&limit=10",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 5. Test get_orderbook_ticker
        self.client.get_orderbook_ticker("BTC-INR")
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/market/orderbook/ticker?symbol=BTC-INR",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 6. Test get_recent_trades
        self.client.get_recent_trades("BTC-INR", limit=50, page=2)
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/market/trades?symbol=BTC-INR&limit=50&page=2",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 7. Test get_coin_settings (public exchange currencies)
        self.client.get_coin_settings()
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/ex/currencies",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 8. Test get_trading_pairs (public exchangeInfo)
        self.client.get_trading_pairs()
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/ex/exchangeInfo",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 9. Test get_service_status (public system status)
        self.client.get_service_status()
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/system/status",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

        # 10. Test get_server_time (public system time)
        self.client.get_server_time()
        mock_request.assert_called_with(
            "GET",
            "https://sapi.zebpay.com/api/v2/system/time",
            params=None,
            json=None,
            headers={"Content-Type": "application/json"}
        )

    @patch('requests.Session.request')
    @patch('time.time')
    def test_private_get_signing(self, mock_time, mock_request):
        mock_time.return_value = 1700000000.0 # 1700000000000 ms
        mock_response = MagicMock()
        mock_response.json.return_value = {"status": "success"}
        mock_request.return_value = mock_response

        self.client.get_account_balance(symbol="BTC-INR")

        # Private GET endpoint: expect timestamp and signature in headers/URL
        expected_params = {
            "symbol": "BTC-INR",
            "timestamp": 1700000000000
        }
        expected_query = urllib.parse.urlencode(expected_params, quote_via=urllib.parse.quote)
        expected_signature = hmac.new(
            self.api_secret.encode("utf-8"),
            expected_query.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        mock_request.assert_called_with(
            "GET",
            f"https://sapi.zebpay.com/api/v2/account/balance?{expected_query}",
            params=None,
            json=None,
            headers={
                "Content-Type": "application/json",
                "x-auth-apikey": self.api_key,
                "x-auth-signature": expected_signature
            }
        )

    @patch('requests.Session.request')
    @patch('time.time')
    def test_private_post_signing(self, mock_time, mock_request):
        mock_time.return_value = 1700000000.0
        mock_response = MagicMock()
        mock_response.json.return_value = {"status": "success"}
        mock_request.return_value = mock_response

        # Test place_order with amount parameter
        self.client.place_order(
            symbol="BTC-USDT",
            side="BUY",
            type="LIMIT",
            price="50000",
            amount="0.001"
        )

        expected_body = {
            "symbol": "BTC-USDT",
            "side": "BUY",
            "type": "LIMIT",
            "price": "50000",
            "amount": "0.001",
            "timestamp": 1700000000000
        }
        expected_body_str = json.dumps(expected_body, separators=(',', ':'))
        expected_signature = hmac.new(
            self.api_secret.encode("utf-8"),
            expected_body_str.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        mock_request.assert_called_with(
            "POST",
            "https://sapi.zebpay.com/api/v2/ex/orders",
            params=None,
            json=expected_body,
            headers={
                "Content-Type": "application/json",
                "x-auth-apikey": self.api_key,
                "x-auth-signature": expected_signature
            }
        )

    @patch('requests.Session.request')
    @patch('time.time')
    def test_private_delete_signing(self, mock_time, mock_request):
        mock_time.return_value = 1700000000.0
        mock_response = MagicMock()
        mock_response.json.return_value = {"status": "success"}
        mock_request.return_value = mock_response

        self.client.cancel_order(order_id="12345")

        expected_params = {
            "orderId": "12345",
            "timestamp": 1700000000000
        }
        expected_query = urllib.parse.urlencode(expected_params, quote_via=urllib.parse.quote)
        expected_body = {
            "timestamp": 1700000000000
        }
        expected_body_str = json.dumps(expected_body, separators=(',', ':'))
        expected_signature = hmac.new(
            self.api_secret.encode("utf-8"),
            expected_body_str.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        mock_request.assert_called_with(
            "DELETE",
            f"https://sapi.zebpay.com/api/v2/ex/order?{expected_query}",
            params=None,
            json=expected_body,
            headers={
                "Content-Type": "application/json",
                "x-auth-apikey": self.api_key,
                "x-auth-signature": expected_signature
            }
        )

if __name__ == '__main__':
    unittest.main()
