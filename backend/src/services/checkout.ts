import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function createTestOrder(amountInRupees: number, receiptId: string) {
  // Razorpay expects the amount in the smallest currency unit (paise for INR)
  const order = await razorpay.orders.create({
    amount: Math.round(amountInRupees * 100),
    currency: "INR",
    receipt: receiptId,
    notes: { source: "KalaAgent test-mode checkout" },
  });
  return order;
}
