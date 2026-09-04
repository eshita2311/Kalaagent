import { useEffect, useState } from "react";
import type { Product, QueryMatch } from "../types";
import { addToWishlist, fetchWishlistIds, removeFromWishlist } from "../api";
import { useAuth } from "../AuthContext";

interface ProductCardProps {
  match: QueryMatch;
  onBuyNow: (product: Product) => void;
}

// Simple in-memory cache so every card doesn't re-fetch the whole wishlist
let wishlistCache: string[] | null = null;

export default function ProductCard({ match, onBuyNow }: ProductCardProps) {
  const { product, reasoning } = match;
  const { token } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      setSaved(false);
      return;
    }
    if (wishlistCache) {
      setSaved(wishlistCache.includes(product.id));
      return;
    }
    fetchWishlistIds(token).then((ids) => {
      wishlistCache = ids;
      setSaved(ids.includes(product.id));
    });
  }, [token, product.id]);

  async function toggleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!token) return;
    if (saved) {
      await removeFromWishlist(product.id, token);
      wishlistCache = (wishlistCache || []).filter((id) => id !== product.id);
      setSaved(false);
    } else {
      await addToWishlist(product.id, token);
      wishlistCache = [...(wishlistCache || []), product.id];
      setSaved(true);
    }
  }

  return (
    <div className="artisan-card flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="aspect-video relative bg-surface-container">
        <img className="w-full h-full object-cover" src={product.image_url} alt={product.name} />
        {product.gi_tag_status === "GI-Registered" && (
          <div className="absolute top-2 right-2 bg-[#D4A017] text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span> GI-Tagged
          </div>
        )}
        {token && (
          <button
            onClick={toggleWishlist}
            className="absolute top-2 left-2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          >
            <span className={`material-symbols-outlined text-[18px] ${saved ? "text-error" : "text-on-surface-variant"}`}>
              {saved ? "favorite" : "favorite_border"}
            </span>
          </button>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-label-sm uppercase tracking-wider text-secondary mb-1">{product.craft_category}</p>
        <h3 className="font-title-md text-title-md text-on-background mb-1">{product.name}</h3>
        <p className="text-on-surface-variant font-body-md mb-2">
          {product.workshop_name} • {product.region}
        </p>
        <p className="font-headline-lg text-body-lg font-bold text-on-background mb-4">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        <div className="ai-chip text-xs rounded px-2 py-1 mb-4 flex items-start gap-1">
          <span className="material-symbols-outlined text-[14px] mt-0.5">auto_awesome</span>
          <span>{reasoning}</span>
        </div>
        <div className="mt-auto pt-2 border-t border-outline-variant">
          <button
            className="w-full bg-primary-container text-on-primary-container py-2 rounded font-bold text-sm hover:opacity-90 transition-opacity"
            onClick={() => onBuyNow(product)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
