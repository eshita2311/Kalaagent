import { useEffect, useState } from "react";
import { fetchCategories, fetchCatalog, runQuery } from "../api";
import type { Product, QueryMatch } from "../types";
import ProductCard from "./ProductCard";

interface SearchTabProps {
  onBuyNow: (product: Product) => void;
}

export default function SearchTab({ onBuyNow }: SearchTabProps) {
  const [queryText, setQueryText] = useState("authentic Madhubani painting under ₹3000");
  const [matches, setMatches] = useState<QueryMatch[]>([]);
  const [declineReason, setDeclineReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [browseProducts, setBrowseProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // Category browser is a nice-to-have — fail silently
      });
  }, []);

  async function handleSearch() {
    if (!queryText.trim()) return;
    setActiveCategory(null);
    setBrowseProducts([]);
    setLoading(true);
    setError(null);
    setDeclineReason(null);
    try {
      const result = await runQuery(queryText);
      setHasSearched(true);
      if (result.status === "declined") {
        setMatches([]);
        setDeclineReason(result.decline_reason || "Unable to confidently match this request.");
      } else {
        setMatches(result.matches);
      }
    } catch (err) {
      setError("Couldn't reach the backend. Is it running on http://localhost:4000?");
    } finally {
      setLoading(false);
    }
  }

  async function handleCategoryClick(category: string) {
    setMatches([]);
    setDeclineReason(null);
    setError(null);
    setHasSearched(false);
    setActiveCategory(category);
    setLoading(true);
    try {
      const all = await fetchCatalog();
      setBrowseProducts(all.filter((p) => p.craft_category === category));
    } catch (err) {
      setError("Couldn't reach the backend. Is it running on http://localhost:4000?");
    } finally {
      setLoading(false);
    }
  }

  const categoryList = Object.entries(categories);

  return (
    <div>
      {categoryList.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-label-sm uppercase tracking-wider text-on-surface-variant mb-3">Browse by category</p>
          <div className="flex flex-wrap gap-2">
            {categoryList.map(([name, count]) => (
              <button
                key={name}
                onClick={() => handleCategoryClick(name)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  activeCategory === name
                    ? "bg-primary-container text-on-primary-container border-primary-container"
                    : "border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {name} <span className="opacity-60">({count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mb-10">
        <div className="relative flex items-center border border-outline-variant rounded-full bg-surface-container-lowest px-4 py-3 focus-within:border-secondary transition-colors shadow-sm">
          <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-body-lg text-on-background placeholder-on-surface-variant outline-none"
            placeholder="e.g. authentic Madhubani painting under ₹3000"
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full text-sm font-medium ml-2"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-6 bg-error-container text-on-error-container p-3 rounded text-sm">
          {error}
        </div>
      )}

      {declineReason && (
        <div className="max-w-3xl mx-auto mb-6 bg-error-container text-on-error-container p-4 rounded-lg text-sm">
          <p className="font-bold mb-1">Unable to fulfill this request</p>
          <p>{declineReason}</p>
        </div>
      )}

      {activeCategory && browseProducts.length > 0 && (
        <>
          <p className="text-on-surface-variant text-sm mb-4">
            Showing {browseProducts.length} items in <span className="font-bold">{activeCategory}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {browseProducts.map((p) => (
              <ProductCard key={p.id} match={{ product: p, reasoning: `Browsing ${activeCategory}` }} onBuyNow={onBuyNow} />
            ))}
          </div>
        </>
      )}

      {!activeCategory && matches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.map((m) => (
            <ProductCard key={m.product.id} match={m} onBuyNow={onBuyNow} />
          ))}
        </div>
      )}

      {!loading && hasSearched && matches.length === 0 && !declineReason && !error && !activeCategory && (
        <p className="text-center text-on-surface-variant">No results yet — try a search above.</p>
      )}
    </div>
  );
}
