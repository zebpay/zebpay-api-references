import os

from dotenv import load_dotenv

from client import FuturesPrivateWebSocketClient, PRIVATE_EVENTS


load_dotenv()

auth_method = os.getenv('AUTH_METHOD', 'api_key').lower()
if auth_method not in {'api_key', 'jwt'}:
    raise ValueError('AUTH_METHOD must be "api_key" or "jwt"')
common_options = {
    'base_url': os.getenv(
        'WEBSOCKET_BASE_URL',
        'https://sp-futuresws.zebpay.com',
    ),
    'subaccount_id': os.getenv('SUBACCOUNT_ID') or None,
}
auth_options = (
    {
        'jwt': os.getenv('JWT_TOKEN'),
        'client_type': os.getenv('CLIENT_TYPE', 'api'),
    }
    if auth_method == 'jwt'
    else {
        'api_key': os.getenv('API_KEY'),
        'secret_key': os.getenv('SECRET_KEY'),
    }
)

client = FuturesPrivateWebSocketClient(
    **common_options,
    **auth_options,
)


@client.on('connect')
def on_connect():
    print('Socket.IO connected')


@client.on('auth.ok')
def on_auth_ok(details):
    print('Private stream authenticated:', details)


@client.on('auth.error')
def on_auth_error(error):
    print('Private stream authentication failed:', error)


@client.on('connect_error')
def on_connect_error(error):
    print('Connection failed:', error)


@client.on('disconnect')
def on_disconnect(*args):
    print('Disconnected:', *args)


def make_event_handler(event_name):
    def handler(payload):
        print(event_name, payload)
    return handler


for private_event in PRIVATE_EVENTS:
    client.on(private_event, make_event_handler(private_event))


try:
    client.connect()
    client.wait_for_auth()
    client.wait()
except KeyboardInterrupt:
    pass
finally:
    client.disconnect()
