"""
Example usage of the Futures API Client
"""

import os
from dotenv import load_dotenv
from client.client import FuturesApiClient


def run_examples():
    """
    Simple example demonstrating how to use the Futures API client
    """
    try:
        # Load environment variables from .env file
        load_dotenv()

        # Choose which client to use for the examples
        # You can use either JWT or API Key authentication based on your credentials
        client = None

        # Initialize client with JWT authentication
        if os.getenv("JWT_TOKEN"):
            print("Initializing client with JWT authentication...")
            client = FuturesApiClient(
                jwt=os.getenv("JWT_TOKEN"),
                timeout=20  # optional field to configure req timeout - default=30 secs
            )
        elif os.getenv("API_KEY") and os.getenv("SECRET_KEY"):
            # Initialize client with API Key authentication
            print("Initializing client with API Key authentication...")
            client = FuturesApiClient(
                api_key=os.getenv("API_KEY"),
                secret_key=os.getenv("SECRET_KEY"),
                timeout=20  # optional field to configure req timeout - default=30 secs
            )
        else:
            # Throw error if credentials are insufficient
            raise ValueError("Credentials Insufficient. One of either JWT or Api Key & Secret Key is required")

        # Example 1: Call a public endpoint (no authentication required)
        print("\nExample 1: Fetching system status (public endpoint)")
        status = client.get_system_status()
        print(f"System status: {status}")

        # Example 2: Call another public endpoint with parameters
        print("\nExample 2: Fetching order book for BTCUSDT (public endpoint)")
        order_book = client.get_order_book("BTCUSDT")
        print("Order book sample:", {
            "symbol": order_book.get("data", {}).get("symbol"),
            "bidCount": len(order_book.get("data", {}).get("bids", [])),
            "askCount": len(order_book.get("data", {}).get("asks", []))
        })

        # Example 3: Call a private endpoint (requires authentication)
        print("\nExample 3: Fetching account balance (private endpoint)")
        balance = client.get_balance()
        print(f"Balance: {balance.get('data')}")

        # Example 4: Place a market order (private endpoint)
        print("\nExample 4: Creating a market order (private endpoint)")
        # Uncomment to execute the order
        """
        order = await client.create_order({
            "symbol": "BTCUSDT",
            "amount": 0.002,  # Small amount for testing
            "side": "BUY",
            "type": "MARKET",
            "marginAsset": "USDT"
        })
        print(f"Order created: {order.get('data')}")
        """
        print("Order creation example (commented out for safety)")

    except Exception as error:
        print(f"Error: {str(error)}")


if __name__ == "__main__":
    # Run the examples
    run_examples()
