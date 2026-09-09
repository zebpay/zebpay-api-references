"""
Authentication utilities for the Zebapy futures API client.
"""

import hmac
import hashlib
import json
import time
from typing import Dict, Any, Optional
from urllib.parse import urlencode


class AuthUtils:
    """
    Authentication helper functions for API requests.
    """

    @staticmethod
    def _normalize_for_js_json(value: Any) -> Any:
        """Normalize values that Python and JSON.stringify encode differently."""
        if isinstance(value, float) and value.is_integer():
            return int(value)
        if isinstance(value, dict):
            return {
                key: AuthUtils._normalize_for_js_json(item)
                for key, item in value.items()
            }
        if isinstance(value, (list, tuple)):
            return [AuthUtils._normalize_for_js_json(item) for item in value]
        return value

    @staticmethod
    def serialize_body(body: Dict[str, Any]) -> str:
        """Serialize a request body like the server's JSON.stringify for API values."""
        normalized = AuthUtils._normalize_for_js_json(body)
        return json.dumps(
            normalized,
            separators=(',', ':'),
            ensure_ascii=False,
            allow_nan=False
        )

    @staticmethod
    def get_jwt_auth_headers(jwt: str) -> Dict[str, str]:
        """
        Creates authentication headers for JWT-based authentication.

        Args:
            jwt (str): JWT authentication token

        Returns:
            Dict[str, str]: Authentication headers

        Raises:
            ValueError: If JWT token is not provided
        """
        if not jwt:
            raise ValueError("JWT token is required for authentication")

        return {
            'Authorization': f'Bearer {jwt}'
        }

    @staticmethod
    def get_api_key_auth_headers_for_get_req(
        api_key: str,
        secret_key: str,
        query_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        """
        Creates authentication headers for API key-based authentication for GET requests.

        Args:
            api_key (str): API key
            secret_key (str): API secret key
            query_params (Dict[str, Any], optional): Query parameters for the request

        Returns:
            Dict[str, str]: Authentication headers with API key and signature

        Raises:
            ValueError: If API key or secret key is not provided
        """
        if not api_key or not secret_key:
            raise ValueError("API key and secret key are required for authentication")

        # Clone query params to avoid modifying the original
        params = query_params.copy() if query_params else {}

        # Preserve the request builder's timestamp so the signed and
        # transmitted query parameters are identical.
        params.setdefault('timestamp', int(time.time() * 1000))

        # Create the query string
        query_string = urlencode(params, doseq=True)

        # Generate signature
        signature = hmac.new(
            secret_key.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        return {
            'x-auth-apikey': api_key,
            'x-auth-signature': signature
        }

    @staticmethod
    def get_api_key_auth_headers_for_non_get_req(
        api_key: str,
        secret_key: str,
        body_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        """
        Creates authentication headers for API key-based authentication for POST, PUT, DELETE requests.

        Args:
            api_key (str): API key
            secret_key (str): API secret key
            body_params (Dict[str, Any], optional): Body parameters for the request

        Returns:
            Dict[str, str]: Authentication headers with API key and signature

        Raises:
            ValueError: If API key or secret key is not provided
        """
        if not api_key or not secret_key:
            raise ValueError("API key and secret key are required for authentication")

        # Clone body params to avoid modifying the original
        body = body_params.copy() if body_params else {}

        # Preserve the request builder's timestamp.
        body.setdefault('timestamp', int(time.time() * 1000))

        # Convert body to JSON string
        body_string = AuthUtils.serialize_body(body)

        # Generate signature
        signature = hmac.new(
            secret_key.encode('utf-8'),
            body_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        return {
            'x-auth-apikey': api_key,
            'x-auth-signature': signature,
            'Content-Type': 'application/json'
        }

    @staticmethod
    def is_private_endpoint(endpoint: str) -> bool:
        """
        Determines if an endpoint requires authentication.

        Args:
            endpoint (str): API endpoint path

        Returns:
            bool: True if the endpoint requires authentication
        """
        # Private endpoints include wallet and trade operations
        return '/api/v1/wallet' in endpoint or '/api/v1/trade' in endpoint
