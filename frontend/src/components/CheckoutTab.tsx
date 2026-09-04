import { useEffect, useState } from "react";
import { confirmCheckout, createCheckout, fetchUpsell } from "../api";
import { useAuth } from "../AuthContext";
import type { Product, UpsellResponse } from "../types";

interface CheckoutTabProps {
  selectedProduct: Product | null;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutTab({ selectedProduct }: CheckoutTabProps) {
  const { user, token } = useAuth();
  const [buyerName, setBuyerName] = useState(user?.name || "");
  const [status, setStatus] = useState<"idle" | "pending" | "created" | "paid" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [upsell, setUpsell] = useState<UpsellResponse | null>(null);
  const [upsellAccepted, setUpsellAccepted] = useState(false);

  useEffect(() => {
    if (user?.name) setBuyerName(user.name);
  }, [user]);

  useEffect(() => {
    if (!selectedProduct) return;
    setUpsell(null);
    setUpsellAccepted(false);
    fetchUpsell(selectedProduct.id)
      .then(setUpsell)
      .catch(() => {
        // Upsell is a nice-to-have — fail silently so it never blocks checkout
      });
  }, [selectedProduct]);

  async function handlePay() {
    if (!selectedProduct || !token) return;
    if (!buyerName.trim()) {
      setErrorMsg("Enter a buyer name to continue.");
      return;
    }
    setStatus("pending");
    setErrorMsg(null);
    try {
      const result = await createCheckout(selectedProduct.id, buyerName, token);
      setStatus("created");

      if (!window.Razorpay) {
        setErrorMsg("Razorpay checkout script hasn't loaded. Check your internet connection and reload.");
        return;
      }

      const rzp = new window.Razorpay({
        key: result.key_id,
        amount: result.amount,
        currency: result.currency,
        name: "KalaAgent",
        description: selectedProduct.name,
        order_id: result.razorpay_order_id,
        handler: async function () {
          setStatus("paid");
          await confirmCheckout(result.order_id, token);
        },
        prefill: { name: buyerName },
        theme: { color: "#94442e" },
        modal: { ondismiss: function () {} },
      });

      rzp.open();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Couldn't reach the backend. Is it running on http://localhost:4000?");
    }
  }

  if (!selectedProduct) {
    return (
      <div className="max-w-2xl mx-auto text-center text-on-surface-variant py-12">
        No product selected yet — go to Search and click "Buy Now" on a product.
      </div>
    );
  }

  const total = selectedProduct.price + (upsellAccepted && upsell?.product ? upsell.discounted_price || 0 : 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-display-lg text-headline-lg mb-6">Checkout</h2>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm mb-6">
        <h3 className="font-title-md text-title-md mb-4 border-b border-outline-variant pb-2">Order Summary</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-surface-container rounded overflow-hidden flex-shrink-0">
            <img className="w-full h-full object-cover" src={selectedProduct.image_url} alt={selectedProduct.name} />
          </div>
          <div className="flex-grow">
            <h4 className="font-body-lg font-bold text-on-background">{selectedProduct.name}</h4>
            <p className="text-on-surface-variant text-sm">
              {selectedProduct.workshop_name} • {selectedProduct.region}
            </p>
          </div>
          <div className="font-body-lg font-bold text-on-background">
            ₹{selectedProduct.price.toLocaleString("en-IN")}
          </div>
        </div>

        {upsellAccepted && upsell?.product && (
          <div className="flex items-center gap-4 mb-4 pt-4 border-t border-dashed border-outline-variant">
            <div className="w-16 h-16 bg-surface-container rounded overflow-hidden flex-shrink-0">
              <img className="w-full h-full object-cover" src={upsell.product.image_url} alt={upsell.product.name} />
            </div>
            <div className="flex-grow">
              <h4 className="font-body-lg font-bold text-on-background">{upsell.product.name}</h4>
              <p className="text-on-surface-variant text-sm">
                Bundle add-on • {upsell.applied_discount_percent}% off applied
              </p>
            </div>
            <div className="text-right">
              <div className="font-body-lg font-bold text-on-background">
                ₹{(upsell.discounted_price || 0).toLocaleString("en-IN")}
              </div>
              <button className="text-error text-xs underline" onClick={() => setUpsellAccepted(false)}>
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-on-surface-variant mb-1">Buyer name</label>
          <input
            className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:border-secondary outline-none"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="e.g. Eshita"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
          <span className="font-body-lg text-on-surface-variant">Total</span>
          <span className="font-headline-lg text-title-md font-bold text-on-background">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {!upsellAccepted && upsell?.status === "suggested" && upsell.product && (
        <div className="ai-chip rounded-lg p-4 mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-[18px] mt-0.5">auto_awesome</span>
          <div className="flex-grow">
            <p className="text-sm font-bold mb-1">
              Frequently bought together: {upsell.product.name}
              {upsell.capped && (
                <span className="ml-2 text-xs font-normal opacity-75">(discount capped at max allowed)</span>
              )}
            </p>
            <p className="text-xs mb-3">{upsell.reasoning}</p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">
                ₹{(upsell.discounted_price || 0).toLocaleString("en-IN")}{" "}
                <span className="line-through opacity-60 font-normal">
                  ₹{upsell.product.price.toLocaleString("en-IN")}
                </span>
              </span>
              <button
                className="bg-secondary text-on-secondary text-xs font-bold px-3 py-1.5 rounded"
                onClick={() => setUpsellAccepted(true)}
              >
                Add to order
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && <p className="text-error text-sm mb-4">{errorMsg}</p>}

      {status === "paid" && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 text-sm font-medium">
          ✓ Payment successful (Test Mode) — order confirmed for {selectedProduct.name}
          {upsellAccepted && upsell?.product ? ` + ${upsell.product.name}` : ""}. Check your Orders tab.
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              status === "paid"
                ? "bg-green-500"
                : status === "created"
                ? "bg-yellow-500"
                : status === "error"
                ? "bg-red-500"
                : "bg-gray-300"
            }`}
          ></span>
          <span className="font-body-md text-on-surface-variant font-medium">
            Status:{" "}
            {status === "paid"
              ? "Paid (Test Mode)"
              : status === "created"
              ? "Awaiting Payment"
              : status === "error"
              ? "Failed"
              : status === "pending"
              ? "Processing…"
              : "Pending Payment"}
          </span>
        </div>
        <button
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-title-md text-body-lg font-bold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
          onClick={handlePay}
          disabled={status === "pending" || status === "paid"}
        >
          {status === "created" ? "Reopen Payment" : "Pay with Razorpay (Test Mode)"}
        </button>
      </div>
    </div>
  );
}
