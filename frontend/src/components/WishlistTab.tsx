import { useEffect, useState } from "react";
import { fetchWishlist, removeFromWishlist } from "../api";
import { useAuth } from "../AuthContext";
import type { Product } from "../types";

interface WishlistTabProps {
  onBuyNow: (product: Product) => void;
}

export default function WishlistTab({ onBuyNow }: WishlistTabProps) {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!token) return;
    setLoading(true);
    fetchWishlist(token)
      .then(setProducts)
      .catch(() => setError("Couldn't reach the backend."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  async function handleRemove(productId: string) {
    if (!token) return;
    await removeFromWishlist(productId, token);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }

  if (loading) return <p className="text-on-surface-variant text-sm">Loading wishlist…</p>;
  if (error) return <p className="text-error text-sm">{error}</p>;

  return (
    <div>
      <h2 className="font-display-lg text-headline-lg mb-6">Your Wishlist</h2>
      {products.length === 0 ? (
        <p className="text-on-surface-variant text-sm">
          Nothing saved yet — tap the heart icon on a product to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="artisan-card flex flex-col h-full">
              <div className="aspect-video bg-surface-container">
                <img className="w-full h-full object-cover" src={product.image_url} alt={product.name} />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-title-md text-title-md text-on-background mb-1">{product.name}</h3>
                <p className="text-on-surface-variant font-body-md mb-2">
                  {product.workshop_name} • {product.region}
                </p>
                <p className="font-headline-lg text-body-lg font-bold text-on-background mb-4">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <div className="mt-auto pt-2 border-t border-outline-variant flex gap-2">
                  <button
                    className="flex-1 bg-primary-container text-on-primary-container py-2 rounded font-bold text-sm hover:opacity-90 transition-opacity"
                    onClick={() => onBuyNow(product)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="px-3 py-2 border border-outline-variant rounded text-error text-sm"
                    onClick={() => handleRemove(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
