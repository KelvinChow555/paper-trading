# Paper Trade (simpler version)

Sign up, get $100,000 of virtual cash, look up any US stock, and buy and sell at the latest closing price.

- **Next.js** pages and server actions (no separate API routes)
- **styled-components** for all styling
- **MongoDB** stores users, sessions, holdings and orders
- **Redis** caches stock data, because the free Massive plan allows only 5 requests a minute

## Setup

1. `npm install`
2. Fill in `.env.local`:

   | Variable | Where to get it |
   |---|---|
   | `MONGO_URI` | MongoDB Atlas, same as mp-5 (Connect → Drivers). It must be Atlas or another replica set, because trades use transactions. |
   | `REDIS_URL` | Local: `brew install redis`, `brew services start redis`, then `redis://localhost:6379`. Or a free Upstash database (`rediss://...`). |
   | `STOCK_API_KEY` | massive.com dashboard, same key as mp-4 |

3. `npm run dev` and open http://localhost:3000

## Files

```
app/
  page.tsx                 home: search for a ticker
  login/, register/        sign in and create an account
  portfolio/page.tsx       account value, holdings, watchlist, reset
  orders/page.tsx          order history
  stock/[ticker]/page.tsx  company info, latest close, chart, buy/sell
component/                 styled-components UI (Styles.tsx has the shared pieces)
lib/
  auth.ts                  server actions: sign up, sign in, sign out
  trade.ts                 server actions: buy/sell (one transaction), reset
  watchlist.ts             server actions: add/remove a ticker
  portfolio.ts             reads holdings, orders and watchlist prices
  session.ts               the sign-in cookie and the current user
  massive.ts               stock API calls, cached with lib/redis.ts
  redis.ts                 cached(): Redis first, the API only on a miss
db.ts                      MongoDB connection and collection names
types.ts                   the shapes of the data
```

## How it keeps data right

- **Money is stored in whole cents**, so there are no rounding errors.
- **Each trade is one MongoDB transaction:** the cash, the shares and the order record are saved together or not at all.
- **A buy only goes through if there's enough cash at that moment**, so two quick buys can't overspend.
- **Passwords are hashed with bcrypt.** The session cookie is httpOnly, and MongoDB stores only a hash of it.
- **If Redis is down, the app still works**, just without the cache.
