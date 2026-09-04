import { Router } from "express";
import { AuthError, getUserById, loginUser, registerUser } from "../services/auth";
import { AuthedRequest, requireAuth } from "../middleware/auth";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are all required." });
  }

  try {
    const result = await registerUser(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Registration failed:", err);
    res.status(500).json({ error: "Registration failed." });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  try {
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(401).json({ error: err.message });
    }
    console.error("Login failed:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

router.get("/auth/me", requireAuth, (req: AuthedRequest, res) => {
  const user = getUserById(req.userId!);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user });
});

export default router;
