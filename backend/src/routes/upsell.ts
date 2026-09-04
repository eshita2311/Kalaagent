import { Router } from "express";
import { runUpsellAgent } from "../services/upsell";
import { db } from "../db";

const router = Router();

router.post("/upsell", async (req, res) => {
  const { productId } = req.body as { productId?: string };

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  try {
    const suggestion = await runUpsellAgent(productId);
    if (!suggestion) {
      return res.json({ status: "no_upsell" });
    }
    res.json({ status: "suggested", ...suggestion });
  } catch (err) {
    console.error("Upsell agent failed:", err);
    res.status(500).json({ error: "Upsell agent failed" });
  }
});

router.get("/upsell-log", (req, res) => {
  try {
    const logs = db.prepare("SELECT * FROM upsell_log ORDER BY timestamp DESC").all();
    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch upsell log" });
  }
});

export default router;
