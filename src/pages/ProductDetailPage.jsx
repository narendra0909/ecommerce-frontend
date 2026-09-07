import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductBySlug } from "../api/products";
import { useCart } from "../context/CartContext";
import {
  effectivePrice,
  formatUSD,
  getApiErrorMessage,
  getProductImages,
} from "../utils/helpers";
import FullPageSpinner from "../components/FullPageSpinner";

function Placeholder() {
  return (
    <div className="flex h-full min-h-96 items-center justify-center bg-gradient-to-br from-peach-soft via-paper to-[#f7e7d7]">
      <span className="text-6xl text-peach/50">✿</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActiveImage(0);
    fetchProductBySlug(slug)
      .then((data) => !cancelled && setProduct(data))
      .catch((err) =>
        !cancelled &&
        setError(
          err.response?.status === 404
            ? "This piece is no longer available."
            : getApiErrorMessage(err)
        )
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <FullPageSpinner label="Loading piece…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="font-serif text-2xl text-wine">{error}</p>
        <Link to="/products" className="btn-primary mt-8">
          Back to Collection
        </Link>
      </div>
    );
  }

  const images = getProductImages(product);
  const price = effectivePrice(product);
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const inStock = product.stock > 0;

  function handleAddToCart() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-[7vw]">
      <nav className="mb-8 text-[11px] uppercase tracking-[0.8px] text-muted">
        <Link to="/" className="hover:text-wine">
          Home
        </Link>
        {" / "}
        <Link to="/products" className="hover:text-wine">
          Collections
        </Link>
        {" / "}
        <span className="text-brown">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          {images.length > 0 ? (
            <>
              <div className="aspect-[7/10] overflow-hidden border border-line bg-white">
                <img
                  src={images[activeImage]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-20 w-16 overflow-hidden border-2 transition ${
                        i === activeImage
                          ? "border-gold opacity-100"
                          : "border-line opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Placeholder />
          )}
        </div>

        <div>
          <p className="eyebrow">Label Vihana · {[product.fabric, product.color].filter(Boolean).join(" · ")}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-wine sm:text-5xl">
            {product.title}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-semibold text-wine">
              {formatUSD(price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatUSD(product.price)}
                </span>
                <span className="bg-sage/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-sage">
                  Save {Math.round((1 - price / product.price) * 100)}%
                </span>
              </>
            )}
          </div>

          <p
            className={`mt-4 inline-block px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1px] ${
              inStock ? "bg-sage/15 text-sage" : "bg-red-50 text-red-700"
            }`}
          >
            {inStock ? `In stock — ${product.stock} available` : "Out of stock"}
          </p>

          <p className="mt-6 whitespace-pre-line font-serif text-lg font-medium leading-relaxed text-[#5c4d45]">
            {product.description}
          </p>

          <dl className="mt-7 grid grid-cols-[110px_1fr] gap-x-6 gap-y-2.5 border border-line bg-paper p-5 text-sm">
            {product.fabric && (
              <>
                <dt className="text-[10px] uppercase tracking-[1.5px] text-muted">Fabric</dt>
                <dd>{product.fabric}</dd>
              </>
            )}
            {product.color && (
              <>
                <dt className="text-[10px] uppercase tracking-[1.5px] text-muted">Color</dt>
                <dd>{product.color}</dd>
              </>
            )}
            {product.careInstructions && (
              <>
                <dt className="text-[10px] uppercase tracking-[1.5px] text-muted">Care</dt>
                <dd>{product.careInstructions}</dd>
              </>
            )}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-line bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={!inStock}
                className="px-4 py-3 text-lg text-brown transition hover:text-wine disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                disabled={!inStock}
                className="px-4 py-3 text-lg text-brown transition hover:text-wine disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary flex-1 sm:flex-none sm:min-w-[200px]"
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>

            <Link to="/cart" className="btn-secondary">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
