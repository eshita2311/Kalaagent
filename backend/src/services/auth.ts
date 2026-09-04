import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { PublicUser, User } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "kalaagent-dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

export async function registerUser(name: string, email: string, password: string): Promise<{ user: PublicUser; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = db.prepare("SELECT id FROM users WHERE email = @email").get({ email: normalizedEmail });
  if (existing) {
    throw new AuthError("An account with this email already exists.");
  }

  if (password.length < 6) {
    throw new AuthError("Password must be at least 6 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (@id, @name, @email, @password_hash, @created_at)"
  ).run({ id, name: name.trim(), email: normalizedEmail, password_hash: passwordHash, created_at: createdAt });

  const user: User = { id, name: name.trim(), email: normalizedEmail, password_hash: passwordHash, created_at: createdAt };
  const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { user: toPublicUser(user), token };
}

export async function loginUser(email: string, password: string): Promise<{ user: PublicUser; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = db.prepare("SELECT * FROM users WHERE email = @email").get({ email: normalizedEmail }) as
    | User
    | undefined;

  if (!user) {
    throw new AuthError("Invalid email or password.");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new AuthError("Invalid email or password.");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { user: toPublicUser(user), token };
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    return payload;
  } catch {
    return null;
  }
}

export function getUserById(userId: string): PublicUser | null {
  const user = db.prepare("SELECT * FROM users WHERE id = @id").get({ id: userId }) as User | undefined;
  return user ? toPublicUser(user) : null;
}
