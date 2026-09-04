import { db } from "../db";
import { getProductById } from "./catalog";

export interface Stats {
  total_queries: number;
  matched_count: number;
  declined_count: number;
  match_rate: number; // percentage, 0-100
  total_orders: number;
  paid_orders: number;
  total_revenue_test_mode: number; // sum of paid order product prices, in rupees
}

export function getStats(): Stats {
  const totalRow = db.prepare("SELECT COUNT(*) as c FROM query_log").get() as { c: number };
  const matchedRow = db.prepare("SELECT COUNT(*) as c FROM query_log WHERE status = 'matched'").get() as {
    c: number;
  };
  const declinedRow = db.prepare("SELECT COUNT(*) as c FROM query_log WHERE status = 'declined'").get() as {
    c: number;
  };

  const totalQueries = totalRow.c;
  const matched = matchedRow.c;
  const declined = declinedRow.c;
  const matchRate = totalQueries > 0 ? Math.round((matched / totalQueries) * 1000) / 10 : 0;

  const totalOrdersRow = db.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number };
  const paidOrders = db
    .prepare("SELECT product_id FROM orders WHERE payment_status IN ('created', 'paid')")
    .all() as { product_id: string }[];

  let revenue = 0;
  for (const row of paidOrders) {
    const product = getProductById(row.product_id);
    if (product) revenue += product.price;
  }

  return {
    total_queries: totalQueries,
    matched_count: matched,
    declined_count: declined,
    match_rate: matchRate,
    total_orders: totalOrdersRow.c,
    paid_orders: paidOrders.length,
    total_revenue_test_mode: revenue,
  };
}
