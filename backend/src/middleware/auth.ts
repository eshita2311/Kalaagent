import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/auth";

export interface AuthedRequest extends Request {
  userId?: string;
}

/** Requires a valid Bearer token. Rejects with 401 if missing/invalid. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Login required." });
  }

  const token = authHeader.slice("Bearer ".length);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }

  req.userId = payload.userId;
  next();
}

/** Attaches userId if a valid token is present, but never rejects the request. */
export function optionalAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    const payload = verifyToken(token);
    if (payload) req.userId = payload.userId;
  }
  next();
}
