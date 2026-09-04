import { Router } from "express";
import { getStats } from "../services/stats";

const router = Router();

router.get("/stats", (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute stats" });
  }
});

export default router;
