import { DatabaseSync } from "node:sqlite";
import path from "path";
import { catalogSeed } from "../data/catalogData";

const DB_PATH = path.join(__dirname, "..", "..", "kalaagent.db");

export const db = new DatabaseSync(DB_PATH);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      art_form TEXT NOT NULL,
      craft_category TEXT NOT NULL,
      region TEXT NOT NULL,
      gi_tag_status TEXT NOT NULL,
      workshop_name TEXT NOT NULL,
      material TEXT NOT NULL,
      price INTEGER NOT NULL,
      trust_score INTEGER NOT NULL,
      image_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS query_log (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      query_text TEXT NOT NULL,
      matched_product_ids TEXT NOT NULL,
      reasoning_text TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      buyer_name TEXT NOT NULL,
      user_id TEXT,
      razorpay_order_id TEXT,
      payment_status TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS upsell_log (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      base_product_id TEXT NOT NULL,
      suggested_product_id TEXT,
      suggested_discount_percent REAL,
      applied_discount_percent REAL,
      reasoning_text TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS help_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  const count = db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number };
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT INTO products (id, name, art_form, craft_category, region, gi_tag_status, workshop_name, material, price, trust_score, image_url)
      VALUES (@id, @name, @art_form, @craft_category, @region, @gi_tag_status, @workshop_name, @material, @price, @trust_score, @image_url)
    `);
    db.exec("BEGIN");
    try {
      for (const p of catalogSeed) insert.run(p as unknown as Record<string, string | number>);
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    console.log(`Seeded ${catalogSeed.length} products into catalog.`);
  }
}
