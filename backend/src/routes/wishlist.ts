import { Router } from "express";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { addToWishlist, getWishlist, getWishlistProductIds, removeFromWishlist } from "../services/wishlist";

const router = Router();

router.get("/wishlist", requireAuth, (req: AuthedRequest, res) => {
  try {
    const products = getWishlist(req.userId!);
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wishlist." });
  }
});

router.get("/wishlist/ids", requireAuth, (req: AuthedRequest, res) => {
  try {
    const ids = getWishlistProductIds(req.userId!);
    res.json({ ids });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wishlist ids." });
  }
});

router.post("/wishlist", requireAuth, (req: AuthedRequest, res) => {
  const { productId } = req.body as { productId?: string };
  if (!productId) return res.status(400).json({ error: "productId is required." });
  try {
    addToWishlist(req.userId!, productId);
    res.json({ status: "added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to wishlist." });
  }
});

router.delete("/wishlist/:productId", requireAuth, (req: AuthedRequest, res) => {
  try {
    removeFromWishlist(req.userId!, req.params.productId);
    res.json({ status: "removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from wishlist." });
  }
});

export default router;
