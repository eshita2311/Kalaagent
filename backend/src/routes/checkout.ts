import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { getProductById } from "../services/catalog";
import { createTestOrder } from "../services/checkout";
import { AuthedRequest, requireAuth } from "../middleware/auth";

const router = Router();

router.post("/checkout", requireAuth, async (req: AuthedRequest, res) => {
  const { productId, buyerName } = req.body as { productId?: string; buyerName?: string };

  if (!productId || !buyerName) {
    return res.status(400).json({ error: "productId and buyerName are required" });
  }

  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const orderId = uuidv4();
  const timestamp = new Date().toISOString();

  try {
    const razorpayOrder = await createTestOrder(product.price, orderId);

    db.prepare(
      `INSERT INTO orders (id, product_id, buyer_name, user_id, razorpay_order_id, payment_status, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(orderId, productId, buyerName, req.userId!, razorpayOrder.id, "created", timestamp);

    res.json({
      order_id: orderId,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      product,
      payment_status: "created",
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);

    db.prepare(
      `INSERT INTO orders (id, product_id, buyer_name, user_id, razorpay_order_id, payment_status, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(orderId, productId, buyerName, req.userId!, null, "failed", timestamp);

    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

/**
 * Marks an order as paid once the Razorpay popup's success handler fires on
 * the frontend. NOTE: for a production system you would verify the payment
 * signature Razorpay sends back (HMAC with your key secret) before trusting
 * this — this simplified version trusts the frontend callback, which is
 * fine for a test-mode demo but should NOT be used as-is with real money.
 */
router.post("/checkout/confirm", requireAuth, (req: AuthedRequest, res) => {
  const { orderId } = req.body as { orderId?: string };
  if (!orderId) return res.status(400).json({ error: "orderId is required" });

  const order = db.prepare("SELECT * FROM orders WHERE id = @id AND user_id = @user_id").get({
    id: orderId,
    user_id: req.userId!,
  });
  if (!order) return res.status(404).json({ error: "Order not found" });

  db.prepare("UPDATE orders SET payment_status = 'paid' WHERE id = @id").run({ id: orderId });
  res.json({ status: "paid" });
});

router.get("/orders", requireAuth, (req: AuthedRequest, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM orders WHERE user_id = @user_id ORDER BY timestamp DESC")
      .all({ user_id: req.userId! }) as {
      id: string;
      product_id: string;
      buyer_name: string;
      payment_status: string;
      timestamp: string;
    }[];

    const orders = rows.map((row) => ({
      ...row,
      product: getProductById(row.product_id) || null,
    }));

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ order });
});

export default router;
