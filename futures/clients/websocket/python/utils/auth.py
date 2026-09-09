import hashlib
import hmac
import json
import time
from typing import Any, Dict, Optional


def normalize_subaccount_id(subaccount_id: Any) -> Optional[str]:
    if subaccount_id is None:
        return None
    value = str(subaccount_id).strip()
    if not value:
        return None
    if not value.isdigit():
        raise ValueError('subaccount_id must be a numeric account ID')
    return value


def build_signature_payload(
    timestamp: int,
    subaccount_id: Any = None
) -> str:
    if (
        isinstance(timestamp, bool)
        or not isinstance(timestamp, int)
        or abs(timestamp) > 9_007_199_254_740_991
    ):
        raise ValueError('timestamp must be a safe integer in milliseconds')
    payload: Dict[str, Any] = {'timestamp': timestamp}
    normalized_subaccount_id = normalize_subaccount_id(subaccount_id)
    if normalized_subaccount_id:
        payload['subaccountId'] = normalized_subaccount_id
    return json.dumps(payload, separators=(',', ':'), ensure_ascii=False)


def create_api_key_auth(
    api_key: str,
    secret_key: str,
    subaccount_id: Any = None,
    timestamp: Optional[int] = None
) -> Dict[str, Any]:
    normalized_api_key = (
        api_key.strip() if isinstance(api_key, str) else ''
    )
    if (
        not normalized_api_key
        or not isinstance(secret_key, str)
        or not secret_key
    ):
        raise ValueError('api_key and secret_key are required')
    if timestamp is None:
        timestamp = int(time.time() * 1000)

    normalized_subaccount_id = normalize_subaccount_id(subaccount_id)
    payload = build_signature_payload(timestamp, normalized_subaccount_id)
    signature = hmac.new(
        secret_key.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    auth: Dict[str, Any] = {
        'clientType': 'api',
        'apiKey': normalized_api_key,
        'signature': signature,
        'timestamp': timestamp
    }
    if normalized_subaccount_id:
        auth['subaccountId'] = normalized_subaccount_id
    return auth
