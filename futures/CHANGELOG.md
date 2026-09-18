# Public Market API changelog

**Date:** 18 September 2026

Compared to documentation on `main`. Covers `GET/POST /api/v1/market/*` and the Node/Python sample clients.

## Breaking

### `GET /api/v1/market/orderBook`
- New optional query parameter `limit` (integer, **1–20**).
- Omit `limit` to get the full book (previous default).
- `limit` outside 1–20, or a non-integer, returns **400**.
- If a client previously sent `?limit=` and it was ignored, that value is now applied (or rejected if invalid).

### `GET /api/v1/market/aggTrade`
- The only accepted query parameter is `symbol`.
- Extra fields (`limit`, `fromId`, `startTime`, `endTime`, or any other) now return **400** (`property <name> should not exist`).
- Previously extra query parameters were ignored.

### `POST /api/v1/market/klines`
- Unknown **body** fields now return **400** (they used to be stripped).
- Do not send `interval`, `startTime`, or `endTime` on the wire. Use `timeframe`, `since`, and `until`.
- `limit` range is **5–500** (default **500**). Values outside that range return **400**.
- `since` must be Unix milliseconds ≥ `1000000000000` and not in the future.
- `until` is accepted only together with `since`; it must not precede `since` or be in the future.

### Order book payload
- `datetime` is an ISO-8601 string (was documented as `null`).
- `nonce` is always `null` (was documented as a timestamp number).

### Market info payload
- `lastPrice`, `priceChangePercent`, and `baseAssetVolume` may be **`null`** when unavailable (were documented as always strings).
- Response includes **active markets only**. Extra upstream fields may still appear.

### 24h ticker payload
- `bid` / `bidVolume` / `ask` / `askVolume` are **omitted** when that side of the book has no valid level (were documented as always present).

## Additive / clarified behavior

### Symbols
- `symbol` on order book, ticker, agg-trade, and klines accepts `BTCINR` or `BTC/INR`.
- Trimmed and normalized to uppercase concatenated form. Quotes: `INR` and `USDT` only.

### `GET /api/v1/market/markets`
- Metadata cached internally up to **30 seconds**; `serverTime` is refreshed every response.
- No public `Cache-Control`. Do not rely on `304 Not Modified` (ETag may exist, but `serverTime` changes the body).
- New symbol fields: `tickSz`, `lotSz` (exact decimal strings).
- `filters` is always present (may be `[]`).
- `orderTypes` in examples now include `STOP_MARKET` and `STOP_LIMIT`.
- `rateLimits` in examples now show the deployed request budget (values can differ by environment).

### `GET /api/v1/market/marketInfo`
- Upstream data cached internally up to **1 second**; no public `Cache-Control`.
- `marketPrice` is always a numeric string.

### `GET /api/v1/market/ticker24Hr`
- Best bid/ask come from the current order book when a valid level exists.

### `POST /api/v1/market/klines`
- `timeframe` is optional; default **`1m`**.
- New optional body field `until` (inclusive end, requires `since`).
- Omit `since` → latest `limit` candles. Provide `since` → first page from that point, optionally bounded by `until`.
- `priceType=MARK_PRICE`: missing/malformed volume is `null`.
- OHLC/volume values may be string or number.

### Envelope
- Success `statusDescription` / `customMessage` example is `"OK"` (was `"Success"`).

## Sample clients (Node / Python)

- `getOrderBook(symbol, limit?)` / `get_order_book(symbol, limit=None)` — optional depth 1–20.
- `getAggTrade(symbol)` / `get_agg_trade(symbol)` — **symbol only**; do not pass `limit` (Python raises `TypeError` if you do).
- `getKlines` / `get_klines`: `timeframe` no longer required (server default `1m`); local aliases `interval` and `startTime` are still mapped to `timeframe` / `since`; new `until`; `limit` 5–500.
- Typed models updated for `tickSz`/`lotSz`, order-book `datetime`/`nonce`, and nullable market-info fields.

## What did not change

- Paths, methods, and “auth not required” for public market routes.
- Standard `{ statusDescription, data, statusCode, customMessage }` envelope.
- Agg-trade item fields (`aggregateTradeId`, `price`, `quantity`, `tradeTime`, …).
- Kline tuple shape: `[startTime, open, high, low, close, volume, endTime]`.
