import { Router } from "express";
import { getCatalog, getProductById } from "../services/catalog";

const router = Router();

router.get("/catalog", (req, res) => {
  try {
    const { region, artform, maxPrice, category } = req.query;
    const products = getCatalog({
      region: region as string | undefined,
      artform: artform as string | undefined,
      category: category as string | undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch catalog" });
  }
});

router.get("/categories", (req, res) => {
  try {
    const products = getCatalog({});
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.craft_category] = (counts[p.craft_category] || 0) + 1;
    }
    res.json({ categories: counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/product/:id", (req, res) => {
  try {
    const product = getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
