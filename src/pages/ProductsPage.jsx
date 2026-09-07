import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import FullPageSpinner from "../components/FullPageSpinner";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => !cancelled && setProducts(data))
      .catch(() => !cancelled && setError("Unable to load the collection right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.title, p.fabric, p.color].some((f) => f?.toLowerCase().includes(q))
    );
  }, [products, query]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-[7vw]">
      <div className="text-center">
        <p className="eyebrow">Curated by Label Vihana</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-wine sm:text-5xl">
          The <em className="font-medium text-brown">Collection</em>
        </h1>
        <p className="mt-3 text-[11px] uppercase tracking-[1px] text-muted">
          {filtered.length} piece{filtered.length === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, fabric or color…"
          className="input max-w-md rounded-full px-5 text-center"
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <FullPageSpinner label="Loading collection…" />
        ) : error ? (
          <p className="bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center font-serif text-lg text-muted">
            No pieces match your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
