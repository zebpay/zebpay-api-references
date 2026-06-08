from zebpay_spot_client import SpotClient

def main():
    # Example 1: Initialize client WITHOUT credentials for public endpoints
    print("--- Public Endpoints Example ---")
    public_client = SpotClient()
    
    try:
        print("Getting all tickers...")
        tickers = public_client.get_all_tickers()
        print(f"Tickers fetched successfully (count: {len(tickers)})")

        print("\nGetting BTC-USDT order book...")
        orderbook = public_client.get_orderbook(symbol="BTC-USDT", limit=5)
        print(f"Order Book: {orderbook}")
    except Exception as e:
        print(f"Public API Error: {e}")

    print("\n--- Private Endpoints Example ---")
    # Example 2: Initialize client with API key credentials (or JWT) for private endpoints
    #
    # Option A (API Key):
    # client = SpotClient(api_key="your_api_key", api_secret="your_api_secret")
    #
    # Option B (JWT Token):
    # client = SpotClient(jwt="your_jwt_token")
    
    client = SpotClient(
        api_key="your_api_key",
        api_secret="your_api_secret"
    )

    try:
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
            amount="0.001"
        )
        print(f"Order placed: {order}")

        print("\nGetting order details...")
        order_details = client.get_order_details(order_id=order["orderId"])
        print(f"Order Details: {order_details}")

        print("\nCanceling order...")
        cancel_result = client.cancel_order(order_id=order["orderId"])
        print(f"Cancel Result: {cancel_result}")

        # New feature: cancel all orders across all symbols
        print("\nCanceling all active orders...")
        cancel_all_result = client.cancel_all_orders_all_symbols()
        print(f"Cancel All Result: {cancel_all_result}")

    except Exception as e:
        print(f"Private API Error: {e}")

if __name__ == "__main__":
    main()