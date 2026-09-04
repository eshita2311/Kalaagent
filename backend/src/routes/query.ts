import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { runAgentQuery } from "../services/agent";

const router = Router();

router.post("/query", async (req, res) => {
  const { query } = req.body as { query?: string };

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Missing 'query' string in request body" });
  }

  try {
    const decision = await runAgentQuery(query);

    const logId = uuidv4();
    const timestamp = new Date().toISOString();
    const matchedIds = decision.matches.map((m) => m.product.id);
    const reasoningText =
      decision.status === "matched"
        ? decision.matches.map((m) => `${m.product.name}: ${m.reasoning}`).join(" | ")
        : decision.decline_reason || "Declined";

    db.prepare(
      `INSERT INTO query_log (id, timestamp, query_text, matched_product_ids, reasoning_text, status)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(logId, timestamp, query, JSON.stringify(matchedIds), reasoningText, decision.status);

    res.json({ ...decision, log_id: logId, timestamp });
  } catch (err) {
    console.error("Agent query failed:", err);
    res.status(500).json({ error: "Agent query failed" });
  }
});

router.get("/audit-log", (req, res) => {
  try {
    const logs = db.prepare("SELECT * FROM query_log ORDER BY timestamp DESC").all();
    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch audit log" });
  }
});

export default router;
