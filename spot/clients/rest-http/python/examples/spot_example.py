from zebpay_spot_client import SpotClient

def main():
    # Initialize client
    client = SpotClient(
        api_key="your_api_key",
        api_secret="your_api_secret"
    )

    try:
        # Market Data Examples
        print("Getting all tickers...")
        tickers = client.get_all_tickers()
        print(f"Tickers: {tickers}")

        print("\nGetting BTC-USDT order book...")
        orderbook = client.get_orderbook(symbol="BTC-USDT", limit=5)
        print(f"Order Book: {orderbook}")

        print("\nGetting BTC-USDT recent trades...")
        trades = client.get_recent_trades(symbol="BTC-USDT", limit=5)
        print(f"Recent Trades: {trades}")

        # Exchange Examples
        print("\nGetting account balance...")
        balance = client.get_account_balance()
        print(f"Balance: {balance}")

        print("\nGetting trading pairs...")
        pairs = client.get_trading_pairs()
        print(f"Trading Pairs: {pairs}")

        # Order Examples
        print("\nPlacing a new order...")
        order = client.place_order(
            symbol="BTC-USDT",
            side="BUY",
            type="LIMIT",
            price="50000",
            quantity="0.001"
        )
        print(f"Order placed: {order}")

        print("\nGetting order details...")
        order_details = client.get_order_details(order_id=order["orderId"])
        print(f"Order Details: {order_details}")

        print("\nCanceling order...")
        cancel_result = client.cancel_order(order_id=order["orderId"])
        print(f"Cancel Result: {cancel_result}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 