import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import {
  formatUSD,
  effectivePrice,
  getApiErrorMessage,
  getProductImages,
} from "../utils/helpers";
import FullPageSpinner from "../components/FullPageSpinner";

function StatusBadge({ status }) {
  const isPublished = status === "PUBLISHED";
  return (
    <span
      className={`px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[1px] ${
        isPublished ? "bg-sage/15 text-sage" : "bg-stone-200 text-muted"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => !cancelled && setProducts(data))
      .catch((err) =>
        !cancelled && setError(getApiErrorMessage(err, "Unable to load products."))
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <FullPageSpinner label="Loading products…" />;

  if (error) {
    return <p className="bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-wine">
            Products
          </h1>
          <p className="mt-1 text-xs text-muted">
            Showing published pieces ({products.length}). Draft-only listing needs
            an admin list endpoint on the backend.
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          + New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-4xl text-peach/50">✿</span>
          <p className="mt-4 font-serif text-xl text-muted">No products yet.</p>
          <Link to="/admin/products/new" className="btn-primary mt-5 inline-flex">
            Create your first piece
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-peach-soft/30 text-[9px] uppercase tracking-[1.5px] text-brown">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-peach-soft/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-[46px] shrink-0 overflow-hidden bg-gradient-to-br from-peach-soft via-paper to-[#f7e7d7]">
                        {getProductImages(p)[0] && (
                          <img
                            src={getProductImages(p)[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-serif text-base font-semibold text-wine">
                          {p.title}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {[p.fabric, p.color].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="font-medium">
                      {formatUSD(effectivePrice(p))}
                    </span>
                    {p.discountPrice != null && p.discountPrice < p.price && (
                      <span className="ml-1.5 text-xs text-muted line-through">
                        {formatUSD(p.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.stock > 0 ? "" : "font-medium text-red-700"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      state={{ product: p }}
                      className="text-[10px] font-semibold uppercase tracking-[1px] text-wine underline decoration-gold decoration-1 underline-offset-4"
                    >
                      Edit
                    </Link>
                    <span className="mx-2 text-line">|</span>
                    <Link
                      to={`/products/${p.slug}`}
                      target="_blank"
                      className="text-[10px] font-semibold uppercase tracking-[1px] text-muted hover:text-wine"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
