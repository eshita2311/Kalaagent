import { db } from "../db";
import { Product } from "../types";

export function getCatalog(filters: {
  region?: string;
  artform?: string;
  maxPrice?: number;
  category?: string;
}): Product[] {
  let query = "SELECT * FROM products WHERE 1=1";
  const params: Record<string, string | number> = {};

  if (filters.region) {
    query += " AND region = @region";
    params.region = filters.region;
  }
  if (filters.artform) {
    query += " AND art_form = @artform";
    params.artform = filters.artform;
  }
  if (filters.category) {
    query += " AND craft_category = @category";
    params.category = filters.category;
  }
  if (filters.maxPrice !== undefined) {
    query += " AND price <= @maxPrice";
    params.maxPrice = filters.maxPrice;
  }

  return db.prepare(query).all(params) as unknown as Product[];
}

export function getProductById(id: string): Product | undefined {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
}

export function getAllProducts(): Product[] {
  return db.prepare("SELECT * FROM products").all() as unknown as Product[];
}
