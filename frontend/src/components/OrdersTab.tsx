import { useEffect, useState } from "react";
import { fetchOrders } from "../api";
import { useAuth } from "../AuthContext";
import type { Order } from "../authTypes";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    created: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export default function OrdersTab() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchOrders(token)
      .then(setOrders)
      .catch(() => setError("Couldn't reach the backend."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-on-surface-variant text-sm">Loading orders…</p>;
  if (error) return <p className="text-error text-sm">{error}</p>;

  return (
    <div>
      <h2 className="font-display-lg text-headline-lg mb-6">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-on-surface-variant text-sm">No orders yet — your purchases will show up here.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-center gap-4"
            >
              {order.product && (
                <div className="w-14 h-14 bg-surface-container rounded overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src={order.product.image_url} alt={order.product.name} />
                </div>
              )}
              <div className="flex-grow">
                <h4 className="font-body-lg font-bold text-on-background">
                  {order.product?.name || "Product no longer available"}
                </h4>
                <p className="text-on-surface-variant text-xs">
                  {new Date(order.timestamp).toLocaleString()} • Buyer: {order.buyer_name}
                </p>
              </div>
              <div className="text-right">
                {order.product && (
                  <p className="font-bold text-on-background mb-1">
                    ₹{order.product.price.toLocaleString("en-IN")}
                  </p>
                )}
                <span className={`text-xs font-bold px-2 py-1 rounded ${statusBadge(order.payment_status)}`}>
                  {order.payment_status === "paid"
                    ? "Paid"
                    : order.payment_status === "created"
                    ? "Awaiting Payment"
                    : "Failed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
