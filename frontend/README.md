# KalaAgent Frontend

React + TypeScript + Vite + Tailwind CSS frontend for KalaAgent.

This was converted directly from the original Stitch design (code.html) —
the exact same Tailwind classes, colors, spacing, and layout were preserved
and split into React components; no visual redesign was done.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy the env file and set your backend URL (default is fine if running
   the backend locally on port 4000):
   ```
   cp .env.example .env
   ```

3. Run the dev server:
   ```
   npm run dev
   ```
   Opens on http://localhost:5173

**Make sure the backend is running first** (see /backend README) — this
frontend has no mock data; every screen calls the real API.

## Structure

- `src/App.tsx` — tab state + layout (replaces the original vanilla JS `switchTab`)
- `src/components/TopNavBar.tsx` — nav bar with tab buttons
- `src/components/SearchTab.tsx` — search bar + AI-matched results, wired to `POST /api/query`
- `src/components/ProductCard.tsx` — individual product card
- `src/components/AuditTrailTab.tsx` — query history table, wired to `GET /api/audit-log`
- `src/components/CheckoutTab.tsx` — order summary + Razorpay test-mode checkout, wired to `POST /api/checkout`
- `src/api.ts` — all backend API calls in one place
- `src/types.ts` — shared TypeScript interfaces matching the backend's response shapes
