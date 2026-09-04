export interface Product {
  id: string;
  name: string;
  art_form: string;
  craft_category:
    | "Painting"
    | "Pottery and Clay Craft"
    | "Textile and Fiber Craft"
    | "Basketry and Cane Craft"
    | "Wood and Stone Craft"
    | "Metal Craft"
    | "Paper Craft";
  region: string;
  gi_tag_status: "GI-Registered" | "Not GI-Registered" | "Pending";
  workshop_name: string;
  material: string;
  price: number;
  trust_score: number; // 0-100, computed from provenance completeness
  image_url: string;
}

export interface QueryLogEntry {
  id: string;
  timestamp: string;
  query_text: string;
  matched_product_ids: string; // JSON-stringified array
  reasoning_text: string;
  status: "matched" | "declined";
}

export interface OrderEntry {
  id: string;
  product_id: string;
  buyer_name: string;
  razorpay_order_id: string | null;
  payment_status: "pending" | "created" | "paid" | "failed";
  timestamp: string;
}

export interface AgentDecision {
  status: "matched" | "declined";
  matches: Array<{ product: Product; reasoning: string }>;
  decline_reason?: string;
}

export interface UpsellSuggestion {
  product: Product;
  reasoning: string;
  suggested_discount_percent: number; // what the AI proposed
  applied_discount_percent: number; // what was actually granted, after server-side cap
  discounted_price: number;
  capped: boolean; // true if the AI's suggestion exceeded the allowed max and was reduced
}

export interface UpsellLogEntry {
  id: string;
  timestamp: string;
  base_product_id: string;
  suggested_product_id: string | null;
  suggested_discount_percent: number | null;
  applied_discount_percent: number | null;
  reasoning_text: string;
  status: "suggested" | "no_upsell" | "capped";
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface WishlistEntry {
  id: string;
  user_id: string;
  product_id: string;
  timestamp: string;
}

export interface HelpTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: "open" | "resolved";
  timestamp: string;
}
