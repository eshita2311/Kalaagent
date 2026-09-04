import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { AuthedRequest, requireAuth } from "../middleware/auth";

const router = Router();

router.post("/help-tickets", requireAuth, (req: AuthedRequest, res) => {
  const { subject, message } = req.body as { subject?: string; message?: string };

  if (!subject || !message) {
    return res.status(400).json({ error: "subject and message are required." });
  }

  const id = uuidv4();
  const timestamp = new Date().toISOString();

  db.prepare(
    "INSERT INTO help_tickets (id, user_id, subject, message, status, timestamp) VALUES (@id, @user_id, @subject, @message, @status, @timestamp)"
  ).run({ id, user_id: req.userId!, subject, message, status: "open", timestamp });

  res.status(201).json({ id, status: "open", timestamp });
});

router.get("/help-tickets", requireAuth, (req: AuthedRequest, res) => {
  try {
    const tickets = db
      .prepare("SELECT * FROM help_tickets WHERE user_id = @user_id ORDER BY timestamp DESC")
      .all({ user_id: req.userId! });
    res.json({ tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets." });
  }
});

export default router;
