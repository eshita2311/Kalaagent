export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  product_id: string;
  buyer_name: string;
  payment_status: string;
  timestamp: string;
  product: import("./types").Product | null;
}
