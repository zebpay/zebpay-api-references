from typing import Any, Dict, Generic, List, Optional, Tuple, TypeVar, TypedDict

T = TypeVar('T')

# ---------------------------
# Core Response Structure
# ---------------------------
class ApiResponse(TypedDict, Generic[T]):
    """
    Standard API response structure.

    Attributes:
        statusDescription (str): Human-readable status description.
        data (T): Response data of type T.
        statusCode (int): HTTP status code.
        customMessage (List[str]): Additional messages.
    """
    statusDescription: str
    data: T
    statusCode: int
    customMessage: List[str]

# ---------------------------
# Market Data Types
# ---------------------------
class OrderBook(TypedDict):
    """
    OrderBook represents market depth for a trading pair.

    Attributes:
        symbol (str): Trading pair symbol (e.g., "BTCUSDT").
        bids (List[Tuple[float, float]]): Buy orders as [price, amount] pairs.
        asks (List[Tuple[float, float]]): Sell orders as [price, amount] pairs.
        timestamp (Optional[int]): Unix timestamp in milliseconds.
        datetime (Optional[str]): ISO8601 datetime string.
        nonce (Optional[int]): Exchange-provided sequence number.
    """
    symbol: str
    bids: List[Tuple[float, float]]
    asks: List[Tuple[float, float]]
    timestamp: Optional[int]
    datetime: Optional[str]
    nonce: Optional[int]

class TickerInfo(TypedDict):
    """
    Raw ticker information from the exchange.

    Attributes:
        eventTimestamp (int)
        symbol (str)
        priceChange (str)
        priceChangePercentage (str)
        weightedAveragePrice (str)
        lastPrice (str)
        lastQuantityTraded (str)
        openPrice (str)
        highestPrice (str)
        lowestPrice (str)
        totalTradedVolume (str)
        totalTradedQuoteAssetVolume (str)
        startTime (int)
        endTime (int)
        firstTradeId (int)
        lastTradeId (int)
        numberOfTrades (int)
    """
    eventTimestamp: int
    symbol: str
    priceChange: str
    priceChangePercentage: str
    weightedAveragePrice: str
    lastPrice: str
    lastQuantityTraded: str
    openPrice: str
    highestPrice: str
    lowestPrice: str
    totalTradedVolume: str
    totalTradedQuoteAssetVolume: str
    startTime: int
    endTime: int
    firstTradeId: int
    lastTradeId: int
    numberOfTrades: int

class Ticker(TypedDict):
    """
    Ticker represents 24-hour market statistics.

    Attributes:
        symbol (str): Trading pair symbol.
        info (TickerInfo): Raw ticker data.
        timestamp (int): Unix timestamp in milliseconds.
        datetime (str): ISO8601 datetime string.
        high (float): Highest price in the period.
        low (float): Lowest price in the period.
        vwap (float): Volume-weighted average price.
        open (float): Opening price.
        close (float): Closing price.
        last (float): Last traded price.
        change (float): Price change.
        percentage (float): Price change percentage.
        average (float): Average price.
        baseVolume (float): Trading volume in base asset.
        quoteVolume (float): Trading volume in quote asset.
    """
    symbol: str
    info: TickerInfo
    timestamp: int
    datetime: str
    high: float
    low: float
    vwap: float
    open: float
    close: float
    last: float
    change: float
    percentage: float
    average: float
    baseVolume: float
    quoteVolume: float

class MarketSymbol(TypedDict):
    """
    Represents a single trading symbol.

    Attributes:
        symbol (str)
        status (str)
        maintMarginPercent (str)
        requiredMarginPercent (str)
        baseAsset (str)
        quoteAsset (str)
        pricePrecision (int)
        quantityPrecision (int)
        baseAssetPrecision (int)
        quotePrecision (int)
        filters (List[Dict[str, Any]])
        orderTypes (List[str])
        timeInForce (List[str])
    """
    symbol: str
    status: str
    maintMarginPercent: str
    requiredMarginPercent: str
    baseAsset: str
    quoteAsset: str
    pricePrecision: int
    quantityPrecision: int
    baseAssetPrecision: int
    quotePrecision: int
    filters: List[Dict[str, Any]]
    orderTypes: List[str]
    timeInForce: List[str]

class Markets(TypedDict):
    """
    Markets represents all available market data.

    Attributes:
        timezone (str)
        serverTime (int)
        rateLimits (List[Dict[str, Any]])
        exchangeFilters (List[Dict[str, Any]])
        symbols (List[MarketSymbol])
    """
    timezone: str
    serverTime: int
    rateLimits: List[Dict[str, Any]]
    exchangeFilters: List[Dict[str, Any]]
    symbols: List[MarketSymbol]

class AggregateTrade(TypedDict):
    """
    AggregateTrade represents combined trades at the same price.

    Attributes:
        aggregateTradeId (int)
        symbol (str)
        price (str)
        quantity (str)
        firstTradeId (int)
        lastTradeId (int)
        tradeTime (int)
        isBuyerMarketMaker (bool)
    """
    aggregateTradeId: int
    symbol: str
    price: str
    quantity: str
    firstTradeId: int
    lastTradeId: int
    tradeTime: int
    isBuyerMarketMaker: bool

# ---------------------------
# Wallet & Order Types
# ---------------------------
class AssetBalance(TypedDict):
    """
    Represents balance information for a single asset.

    Attributes:
        total (float)
        free (float)
        used (float)
    """
    total: float
    free: float
    used: float

# WalletBalance is a mapping from asset symbol to its balance.
WalletBalance = Dict[str, AssetBalance]

class Order(TypedDict, total=False):
    """
    Represents an order.

    Required attributes:
        clientOrderId (str)
        datetime (str)
        timestamp (int)
        symbol (str)
        type (str)
        timeInForce (str)
        side (str)
        price (float)
        amount (float)
        filled (float)
        remaining (float)
        reduceOnly (bool)
        postOnly (bool)
    Optional attributes:
        status (str)
        average (float)
        trades (List[Dict[str, Any]])
        info (Dict[str, Any])
    """
    clientOrderId: str
    datetime: str
    timestamp: int
    symbol: str
    type: str
    timeInForce: str
    side: str
    price: float
    amount: float
    filled: float
    remaining: float
    reduceOnly: bool
    postOnly: bool
    status: str
    average: float
    trades: List[Dict[str, Any]]
    info: Dict[str, Any]

class Position(TypedDict, total=False):
    """
    Represents a futures trading position.

    Attributes:
        id (str)
        symbol (str)
        timestamp (int)
        datetime (str)
        side (str)
        contracts (float)
        contractSize (float)
        entryPrice (float)
        notional (float)
        leverage (float)
        initialMargin (float)
        liquidationPrice (float)
        marginMode (str)
        status (str)  # Optional
    """
    id: str
    symbol: str
    timestamp: int
    datetime: str
    side: str
    contracts: float
    contractSize: float
    entryPrice: float
    notional: float
    leverage: float
    initialMargin: float
    liquidationPrice: float
    marginMode: str
    status: str

class LeverageInfo(TypedDict, total=False):
    """
    Additional leverage information.

    Attributes:
        contractName (str)
        leverage (int)  # Present in GET responses
        updatedLeverage (int)  # Present in update responses
        openPositionCount (int)
    """
    contractName: str
    leverage: int
    updatedLeverage: int
    openPositionCount: int

class Leverage(TypedDict):
    """
    Represents user leverage settings.

    Attributes:
        symbol (str)
        marginMode (str)
        longLeverage (float)
        shortLeverage (float)
        info (LeverageInfo)
    """
    symbol: str
    marginMode: str
    longLeverage: float
    shortLeverage: float
    info: LeverageInfo | str

class MarginInfo(TypedDict):
    """
    Information returned from a margin operation.

    Attributes:
        lockedBalance (float)
        withdrawableBalance (float)
        asset (str)
        message (str)
    """
    lockedBalance: float
    withdrawableBalance: float
    asset: str
    message: str

class MarginResponse(TypedDict):
    """
    Represents the response from margin operations.

    Attributes:
        info (MarginInfo)
        type (str)
        amount (float)
        code (str)
        symbol (str)
        status (str)
    """
    info: MarginInfo
    type: str
    amount: float
    code: str
    symbol: str
    status: str

# ---------------------------
# Trade & Transaction Types
# ---------------------------
class Fee(TypedDict):
    """
    Trade fee details.

    Attributes:
        cost (float)
        currency (str)
    """
    cost: float
    currency: str

class Trade(TypedDict):
    """
    Represents a completed trade.

    Attributes:
        id (str)
        timestamp (int)
        datetime (str)
        symbol (str)
        order (str)
        type (str)
        side (str)
        takerOrMaker (str)
        price (float)
        amount (float)
        cost (float)
        fee (Fee)
        info (Dict[str, Any])
    """
    id: str
    timestamp: int
    datetime: str
    symbol: str
    order: str
    type: str
    side: str
    takerOrMaker: str
    price: float
    amount: float
    cost: float
    fee: Fee
    info: Dict[str, Any]

class TransactionFee(TypedDict, total=False):
    """
    Transaction fee details.

    Attributes:
        currency (str)
    """
    currency: str

class Transaction(TypedDict):
    """
    Represents a wallet transaction.

    Attributes:
        txid (str)
        timestamp (int)
        datetime (str)
        type (str)
        amount (float)
        currency (str)
        status (str)
        fee (TransactionFee)
        info (Dict[str, Any])
    """
    txid: str
    timestamp: int
    datetime: str
    type: str
    amount: float
    currency: str
    status: str
    fee: TransactionFee
    info: Dict[str, Any]

# ---------------------------
# Exchange & Pairs Info Types
# ---------------------------
class PairInfo(TypedDict):
    """
    Represents detailed information for a trading pair.

    Attributes:
        name (str)
        pair (str)
        orderTypes (List[str])
        filters (List[Dict[str, Any]])
        makerFee (float)
        takerFee (float)
        maxLeverage (int)
        minLeverage (int)
        depthGrouping (List[str])
        liquidationFee (str)
        pricePrecision (str)
        quantityPrecision (str)
        maintenanceMarginPercentage (str)
        marginBufferPercentage (str)
        marginBuffer (str)
        reduceMarginAllowedRatioPercent (int)
        iconURL (str)
        baseAsset (str)
        quoteAsset (str)
        marginAssetsSupported (List[str])
        limitPriceVarAllowed (int)
        fundingFeeInterval (int)
    """
    name: str
    pair: str
    orderTypes: List[str]
    filters: List[Dict[str, Any]]
    makerFee: float
    takerFee: float
    maxLeverage: int
    minLeverage: int
    depthGrouping: List[str]
    liquidationFee: str
    pricePrecision: str
    quantityPrecision: str
    maintenanceMarginPercentage: str
    marginBufferPercentage: str
    marginBuffer: str
    reduceMarginAllowedRatioPercent: int
    iconURL: str
    baseAsset: str
    quoteAsset: str
    marginAssetsSupported: List[str]
    limitPriceVarAllowed: int
    fundingFeeInterval: int

class QuoteCurrency(TypedDict):
    """
    Represents a quote currency.

    Attributes:
        code (str)
        name (str)
        iconDarkTheme (str)
        iconLightTheme (str)
        currencyPrecision (int)
    """
    code: str
    name: str
    iconDarkTheme: str
    iconLightTheme: str
    currencyPrecision: int

class ExchangeInfo(TypedDict):
    """
    Represents detailed exchange configuration.

    Attributes:
        pairs (List[PairInfo])
        quoteCurrencies (List[QuoteCurrency])
        categories (List[str])
        conversionRates (Dict[str, float])
    """
    pairs: List[PairInfo]
    quoteCurrencies: List[QuoteCurrency]
    categories: List[str]
    conversionRates: Dict[str, float]

class PairsInfoPair(TypedDict):
    """
    Represents information about a trading pair in the pairs listing.

    Attributes:
        name (str)
        pair (str)
        isActive (bool)
        iconURL (str)
        baseAsset (str)
        quoteAsset (str)
        marginAsset (str)
        types (List[str])
        quoteCurrencies (List[QuoteCurrency])
        categories (List[str])
        conversionRates (Dict[str, float])
    """
    name: str
    pair: str
    isActive: bool
    iconURL: str
    baseAsset: str
    quoteAsset: str
    marginAsset: str
    types: List[str]
    quoteCurrencies: List[QuoteCurrency]
    categories: List[str]
    conversionRates: Dict[str, float]

class PairsInfo(TypedDict):
    """
    Represents information about all trading pairs.

    Attributes:
        pairs (List[PairsInfoPair])
    """
    pairs: List[PairsInfoPair]

class MarketInfo(TypedDict):
    """
    Represents market information for a trading pair.

    Attributes:
        lastPrice (str)
        marketPrice (str)
        priceChangePercent (str)
        baseAssetVolume (str)
    """
    lastPrice: str
    marketPrice: str
    priceChangePercent: str
    baseAssetVolume: str

# ---------------------------
# Order Creation & Cancellation Types
# ---------------------------
class CreateOrderResponseData(TypedDict):
    """
    Represents the response from creating an order.

    Attributes:
        clientOrderId (str)
        datetime (str)
        timestamp (int)
        symbol (str)
        type (str)
        timeInForce (str)
        side (str)
        price (float)
        amount (float)
        filled (float)
        remaining (float)
        reduceOnly (bool)
        postOnly (bool)
    """
    clientOrderId: str
    datetime: str
    timestamp: int
    symbol: str
    type: str
    timeInForce: str
    side: str
    price: float
    amount: float
    filled: float
    remaining: float
    reduceOnly: bool
    postOnly: bool

# Aliases for similar responses
AddTPSLResponseData = CreateOrderResponseData
ClosePositionResponseData = CreateOrderResponseData

class CancelOrderResponseInfo(TypedDict):
    """
    Contains additional cancellation details.

    Attributes:
        clientOrderId (str)
        orderId (int)
        status (str)
        success (bool)
    """
    clientOrderId: str
    orderId: int
    status: str
    success: bool

class CancelOrderResponseData(TypedDict):
    """
    Represents the response from canceling an order.

    Attributes:
        clientOrderId (str)
        status (str)
        symbol (str)
        info (CancelOrderResponseInfo)
    """
    clientOrderId: str
    status: str
    symbol: str
    info: CancelOrderResponseInfo

# ---------------------------
# Paginated Response Types
# ---------------------------
class OrdersListResponse(TypedDict):
    """
    Represents a paginated list of orders.

    Attributes:
        data (List[Order])
        totalCount (int)
        nextTimestamp (int)
    """
    data: List[Order]
    totalCount: int
    nextTimestamp: int

class TradesListResponse(TypedDict):
    """
    Represents a paginated list of trades.

    Attributes:
        data (List[Trade])
        totalCount (int)
        nextTimestamp (int)
    """
    data: List[Trade]
    totalCount: int
    nextTimestamp: int

class TransactionsListResponse(TypedDict):
    """
    Represents a paginated list of transactions.

    Attributes:
        data (List[Transaction])
        totalCount (int)
        nextTimestamp (int)
    """
    data: List[Transaction]
    totalCount: int
    nextTimestamp: int
