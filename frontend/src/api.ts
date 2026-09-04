import type { AuditLogEntry, CheckoutResponse, Product, QueryResponse, Stats, UpsellResponse } from "./types";
import type { Order } from "./authTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchCatalog(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/catalog`);
  if (!res.ok) throw new Error("Failed to fetch catalog");
  const data = await res.json();
  return data.products;
}

export async function fetchCategories(): Promise<Record<string, number>> {
  const res = await fetch(`${API_URL}/api/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
}

export async function runQuery(query: string): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Query failed");
  return res.json();
}

export async function fetchAuditLog(): Promise<AuditLogEntry[]> {
  const res = await fetch(`${API_URL}/api/audit-log`);
  if (!res.ok) throw new Error("Failed to fetch audit log");
  const data = await res.json();
  return data.logs;
}

export async function createCheckout(productId: string, buyerName: string, token: string): Promise<CheckoutResponse> {
  const res = await fetch(`${API_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId, buyerName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Checkout failed");
  return data;
}

export async function confirmCheckout(orderId: string, token: string): Promise<void> {
  await fetch(`${API_URL}/api/checkout/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ orderId }),
  });
}

export async function fetchOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.orders;
}

export async function fetchWishlist(token: string): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  const data = await res.json();
  return data.products;
}

export async function fetchWishlistIds(token: string): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/wishlist/ids`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist ids");
  const data = await res.json();
  return data.ids;
}

export async function addToWishlist(productId: string, token: string): Promise<void> {
  await fetch(`${API_URL}/api/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: string, token: string): Promise<void> {
  await fetch(`${API_URL}/api/wishlist/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_URL}/api/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchUpsell(productId: string): Promise<UpsellResponse> {
  const res = await fetch(`${API_URL}/api/upsell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error("Upsell request failed");
  return res.json();
}
