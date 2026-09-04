export interface Product {
  id: string;
  name: string;
  art_form: string;
  craft_category: string;
  region: string;
  gi_tag_status: "GI-Registered" | "Not GI-Registered" | "Pending";
  workshop_name: string;
  material: string;
  price: number;
  trust_score: number;
  image_url: string;
}

export interface QueryMatch {
  product: Product;
  reasoning: string;
}

export interface QueryResponse {
  status: "matched" | "declined";
  matches: QueryMatch[];
  decline_reason?: string | null;
  log_id?: string;
  timestamp?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  query_text: string;
  matched_product_ids: string;
  reasoning_text: string;
  status: "matched" | "declined";
}

export interface CheckoutResponse {
  order_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  product: Product;
  payment_status: string;
}

export type TabId = "search" | "audit" | "checkout" | "dashboard" | "login" | "wishlist" | "orders" | "help";

export interface Stats {
  total_queries: number;
  matched_count: number;
  declined_count: number;
  match_rate: number;
  total_orders: number;
  paid_orders: number;
  total_revenue_test_mode: number;
}

export interface UpsellResponse {
  status: "suggested" | "no_upsell";
  product?: Product;
  reasoning?: string;
  suggested_discount_percent?: number;
  applied_discount_percent?: number;
  discounted_price?: number;
  capped?: boolean;
}
