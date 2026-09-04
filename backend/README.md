# KalaAgent Backend

Node.js + Express + TypeScript backend for KalaAgent — an AI shopping agent
that helps AI buyers discover and purchase authentic Indian handicrafts.

## Tech Stack
- Node.js + Express + TypeScript
- SQLite (via node:sqlite, built into Node.js) — catalog, query audit log, orders
- Groq API (Llama 3.3 70B) — query intent parsing + matching + reasoning, free tier
- Razorpay (test mode) — checkout

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy the env template and fill in your real keys:
   ```
   cp .env.example .env
   ```
   You need:
   - `GROQ_API_KEY` — free, no credit card: sign up at
     https://console.groq.com, then go to API Keys → Create Key
   - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — from your Razorpay
     Dashboard, **make sure Test Mode is toggled on** before copying keys

3. Run the dev server:
   ```
   npm run dev
   ```
   Server starts on http://localhost:4000 and auto-creates + seeds
   `kalaagent.db` (SQLite) on first run.

4. Confirm it's alive:
   ```
   curl http://localhost:4000/api/health
   ```

## API Endpoints

| Method | Path                | Purpose                                      |
|--------|---------------------|-----------------------------------------------|
| GET    | /api/catalog        | List products (filters: region, artform, maxPrice) |
| GET    | /api/product/:id    | Single product details                        |
| POST   | /api/query          | Send `{ query: string }`, get AI-matched products + reasoning, or a decline |
| GET    | /api/audit-log      | Full history of queries + outcomes            |
| POST   | /api/checkout       | Send `{ productId, buyerName }`, creates a Razorpay test-mode order |
| GET    | /api/orders/:id     | Look up a specific order's status             |

## Architecture Notes

- The AI agent (`src/services/agent.ts`) sends the buyer's query + a
  compact catalog summary to Groq (Llama 3.3 70B), and requires it to
  respond in strict JSON. It is explicitly instructed to **decline rather
  than guess** when a query doesn't map confidently to a real, verifiable
  product — this decline path is a first-class feature, not an error case.
- Every query (matched or declined) is logged to `query_log` — this powers
  the Audit Trail dashboard on the frontend.
- Checkout only ever uses Razorpay **test mode** — do not put live keys
  in `.env` for this project.
