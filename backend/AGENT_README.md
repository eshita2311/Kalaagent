# KalaAgent — Agent-to-Agent Commerce Integration Guide

This document explains how an **external AI buyer agent** (a shopping
assistant, a voice agent, or any autonomous purchasing agent acting on a
user's behalf) can discover and transact with KalaAgent-powered artisan
sellers — without going through KalaAgent's own chat UI at all.

This is the core thing the "AI Growth & Agentic Commerce" track is asking
for: most Indian artisan sellers are structurally invisible to AI shopping
agents today, because they have no structured catalog and no safe,
explainable way for an agent to complete a purchase on a buyer's behalf.
KalaAgent is the missing layer.

## 1. Discovery: agent-readable catalog

```
GET /api/agent-catalog
```

Returns the full catalog in schema.org `Product`/`Offer` structured data —
the same vocabulary search engines and shopping agents already understand.
No authentication, no scraping, no guessing at unstructured product pages.

Each item includes GI-tag status, region, workshop identity, and a trust
score, so an external agent has enough provenance data to decide whether a
product satisfies a buyer's authenticity requirement *before* spending any
tokens on a purchase flow.

## 2. Matching: natural-language query → explainable result

```
POST /api/query
Body: { "query": "authentic Madhubani painting under ₹3000" }
```

An external agent can pass a buyer's raw request straight through. KalaAgent
returns either:
- `{ status: "matched", matches: [...] }` — each match includes a plain-
  language `reasoning` string citing the actual catalog fields that
  justified it (GI-tag, region, price fit)
- `{ status: "declined", decline_reason: "..." }` — when nothing in the
  catalog can be confidently and honestly matched. **This is a first-class
  response, not an error.** An agent acting on a real buyer's money should
  get an honest "I can't verify this" over a confident wrong answer.

## 3. Upsell: bounded, gated secondary offers

```
POST /api/upsell
Body: { "productId": "prod_001" }
```

After a base product is chosen, this proposes at most one complementary
item with an optional discount. Critically: **the discount percentage is
capped in server code (`MAX_DISCOUNT_PERCENT` in `src/services/upsell.ts`),
not by prompting the model to behave**. Whatever discount the AI proposes,
the response's `applied_discount_percent` can never exceed the hard-coded
ceiling — this is what "every money action is bounded and gated" means in
practice, not just in the pitch deck.

## 4. Transaction: test-mode checkout

```
POST /api/checkout
Body: { "productId": "prod_001", "buyerName": "..." }
```

Creates a real Razorpay test-mode order. In a production version, an
external agent would receive the resulting `razorpay_order_id` and complete
payment via whatever agent-to-agent payment protocol it uses (e.g. an
x402-style payment-required handshake, or Razorpay's own agent checkout
APIs as they mature) — the order-creation contract here is protocol-
agnostic on purpose, so it can sit underneath any of those.

## 5. Transparency: everything is logged

```
GET /api/audit-log     — every query + match/decline decision
GET /api/upsell-log    — every upsell proposal, capped or not
GET /api/stats         — aggregate match rate, decline rate, revenue
```

An external agent (or a human auditor) can verify after the fact exactly
why KalaAgent made every recommendation and every discount decision it
made — nothing is a black box.

## Why this matters beyond artisans

The same pattern — structured catalog, explainable matching, a hard-coded
discount ceiling, and a public audit trail — applies to any long-tail,
low-structured-data seller: kirana stores, local service providers, small
D2C brands. Artisan handicrafts are the sharpest version of the problem
(provenance and authenticity genuinely matter here), but the
infrastructure generalizes.
