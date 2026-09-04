import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { initDb } from "./db";
import catalogRoutes from "./routes/catalog";
import queryRoutes from "./routes/query";
import checkoutRoutes from "./routes/checkout";
import statsRoutes from "./routes/stats";
import agentCatalogRoutes from "./routes/agentCatalog";
import upsellRoutes from "./routes/upsell";
import authRoutes from "./routes/auth";
import wishlistRoutes from "./routes/wishlist";
import helpDeskRoutes from "./routes/helpDesk";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Basic abuse protection on the AI-calling and money-moving routes. This is
// a small, real "gating" measure — it doesn't just describe bounded actions
// in the pitch, it enforces a rate ceiling in code.
const agentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});
app.use(["/api/query", "/api/upsell", "/api/checkout"], agentLimiter);

initDb();

app.use("/api", catalogRoutes);
app.use("/api", queryRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", statsRoutes);
app.use("/api", agentCatalogRoutes);
app.use("/api", upsellRoutes);
app.use("/api", authRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", helpDeskRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`KalaAgent backend running on http://localhost:${PORT}`);
});
