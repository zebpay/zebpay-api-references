import threading
import time
from collections import defaultdict
from typing import Any, Callable, DefaultDict, Dict, List, Optional

import socketio

from utils.auth import create_api_key_auth, normalize_subaccount_id


PRIVATE_EVENTS = (
    'newOrder',
    'orderFilled',
    'orderPartiallyFilled',
    'orderCancelled',
    'orderFailed',
    'newPosition',
    'updatePosition',
    'closePosition',
    'balanceUpdate',
    'newTrade',
    'autoTopupSuccess',
    'autoTopupFailed',
    'marginCallAlert',
    'liquidationAlert',
)


class FuturesPrivateWebSocketClient:
    def __init__(
        self,
        jwt: Optional[str] = None,
        token_provider: Optional[Callable[[], str]] = None,
        client_type: str = 'api',
        api_key: Optional[str] = None,
        secret_key: Optional[str] = None,
        subaccount_id: Any = None,
        base_url: str = 'https://futuresws.zebpay.com',
        namespace: str = '/auth-stream',
        socketio_path: str = 'socket.io',
        connect_timeout: float = 20.0,
        socket_client: Optional[socketio.Client] = None,
        now: Optional[Callable[[], int]] = None,
    ) -> None:
        jwt_method_count = int(bool(jwt)) + int(bool(token_provider))
        has_api_key_credentials = bool(api_key or secret_key)
        if jwt_method_count > 1:
            raise ValueError('Provide either jwt or token_provider, not both.')
        if jwt_method_count and has_api_key_credentials:
            raise ValueError(
                'JWT and API key authentication are mutually exclusive.'
            )
        if not jwt_method_count and not has_api_key_credentials:
            raise ValueError(
                'Provide JWT credentials or an API key and secret key.'
            )
        if has_api_key_credentials and (not api_key or not secret_key):
            raise ValueError('Both api_key and secret_key are required.')
        if token_provider is not None and not callable(token_provider):
            raise ValueError('token_provider must be callable.')
        if client_type not in {'api', 'ui'}:
            raise ValueError('client_type must be "api" or "ui".')

        self.jwt = jwt
        self.token_provider = token_provider
        self.client_type = client_type
        self.api_key = api_key
        self.secret_key = secret_key
        self.subaccount_id = normalize_subaccount_id(subaccount_id)
        self.base_url = base_url.rstrip('/')
        self.namespace = (
            namespace if namespace.startswith('/') else f'/{namespace}'
        )
        self.socketio_path = socketio_path.strip('/')
        self.connect_timeout = connect_timeout
        self._now = now or (lambda: int(time.time() * 1000))

        self.authenticated = False
        self.auth_details: Optional[Dict[str, Any]] = None
        self._auth_event = threading.Event()
        self._auth_error: Optional[Dict[str, Any]] = None
        self._handlers: DefaultDict[
            str, List[Callable[..., None]]
        ] = defaultdict(list)

        self.sio = socket_client or socketio.Client(reconnection=False)
        self._register_socket_handlers()

    def on(
        self,
        event: str,
        handler: Optional[Callable[..., None]] = None
    ):
        def decorator(callback: Callable[..., None]):
            self._handlers[event].append(callback)
            return callback

        return decorator(handler) if handler is not None else decorator

    def build_auth(self) -> Dict[str, Any]:
        if self.api_key:
            return create_api_key_auth(
                api_key=self.api_key,
                secret_key=self.secret_key,
                subaccount_id=self.subaccount_id,
                timestamp=self._now(),
            )

        token = self.token_provider() if self.token_provider else self.jwt
        if not token or not isinstance(token, str):
            raise ValueError('JWT token provider returned an empty token.')
        auth: Dict[str, Any] = {
            'clientType': self.client_type,
            'token': token,
        }
        if self.subaccount_id:
            auth['subaccountId'] = self.subaccount_id
        return auth

    def connect(self) -> 'FuturesPrivateWebSocketClient':
        self._connect_once()
        return self

    def disconnect(self) -> 'FuturesPrivateWebSocketClient':
        if getattr(self.sio, 'connected', False):
            self.sio.disconnect()
        return self

    def wait(self) -> None:
        self.sio.wait()

    def wait_for_auth(
        self,
        timeout: float = 10.0
    ) -> Dict[str, Any]:
        if not self._auth_event.wait(timeout):
            raise TimeoutError(
                f'Timed out waiting for auth.ok after {timeout} seconds'
            )
        if self._auth_error is not None:
            message = self._auth_error.get(
                'message',
                'WebSocket authentication failed',
            )
            raise ConnectionError(message)
        return self.auth_details or {}

    def _connect_once(self) -> None:
        self._auth_event.clear()
        self._auth_error = None
        self.sio.connect(
            self.base_url,
            auth=self.build_auth(),
            transports=['websocket'],
            socketio_path=self.socketio_path,
            namespaces=[self.namespace],
            wait=True,
            wait_timeout=self.connect_timeout,
        )

    def _register_socket_handlers(self) -> None:
        self.sio.on(
            'connect',
            handler=self._on_connect,
            namespace=self.namespace,
        )
        self.sio.on(
            'auth.ok',
            handler=self._on_auth_ok,
            namespace=self.namespace,
        )
        self.sio.on(
            'auth.error',
            handler=self._on_auth_error,
            namespace=self.namespace,
        )
        self.sio.on(
            'connect_error',
            handler=self._on_connect_error,
            namespace=self.namespace,
        )
        self.sio.on(
            'disconnect',
            handler=self._on_disconnect,
            namespace=self.namespace,
        )

        for event_name in PRIVATE_EVENTS:
            self.sio.on(
                event_name,
                handler=self._make_event_handler(event_name),
                namespace=self.namespace,
            )

    def _make_event_handler(self, event_name: str) -> Callable[[Any], None]:
        def handler(payload: Any) -> None:
            self._emit(event_name, payload)

        return handler

    def _emit(self, event: str, *args: Any) -> None:
        for handler in list(self._handlers[event]):
            try:
                handler(*args)
            except Exception as error:
                if event != 'handler_error':
                    for error_handler in list(
                        self._handlers['handler_error']
                    ):
                        error_handler(event, error)

    def _on_connect(self, *args: Any) -> None:
        self._emit('connect')

    def _on_auth_ok(self, details: Dict[str, Any]) -> None:
        self.authenticated = True
        self.auth_details = details
        self._auth_error = None
        self._auth_event.set()
        self._emit('auth.ok', details)

    def _on_auth_error(self, error: Dict[str, Any]) -> None:
        self.authenticated = False
        self.auth_details = None
        self._auth_error = error
        self._auth_event.set()
        self._emit('auth.error', error)

    def _on_connect_error(self, error: Any) -> None:
        self._emit('connect_error', error)

    def _on_disconnect(self, *args: Any) -> None:
        self.authenticated = False
        self.auth_details = None
        self._emit('disconnect', *args)
