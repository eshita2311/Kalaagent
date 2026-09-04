import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { getProductById } from "./catalog";
import { Product } from "../types";

export function addToWishlist(userId: string, productId: string): void {
  const existing = db
    .prepare("SELECT id FROM wishlist WHERE user_id = @user_id AND product_id = @product_id")
    .get({ user_id: userId, product_id: productId });
  if (existing) return; // already wishlisted, no-op

  db.prepare("INSERT INTO wishlist (id, user_id, product_id, timestamp) VALUES (@id, @user_id, @product_id, @timestamp)").run(
    { id: uuidv4(), user_id: userId, product_id: productId, timestamp: new Date().toISOString() }
  );
}

export function removeFromWishlist(userId: string, productId: string): void {
  db.prepare("DELETE FROM wishlist WHERE user_id = @user_id AND product_id = @product_id").run({
    user_id: userId,
    product_id: productId,
  });
}

export function getWishlist(userId: string): Product[] {
  const rows = db
    .prepare("SELECT product_id FROM wishlist WHERE user_id = @user_id ORDER BY timestamp DESC")
    .all({ user_id: userId }) as { product_id: string }[];

  const products: Product[] = [];
  for (const row of rows) {
    const product = getProductById(row.product_id);
    if (product) products.push(product);
  }
  return products;
}

export function getWishlistProductIds(userId: string): string[] {
  const rows = db.prepare("SELECT product_id FROM wishlist WHERE user_id = @user_id").all({ user_id: userId }) as {
    product_id: string;
  }[];
  return rows.map((r) => r.product_id);
}
