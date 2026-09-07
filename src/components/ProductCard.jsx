import { Link } from "react-router-dom";
import { formatUSD, effectivePrice, getProductImages } from "../utils/helpers";

function Placeholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-peach-soft via-paper to-[#f7e7d7]">
      <span className="text-5xl text-peach/50">✿</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const image = getProductImages(product)[0];
  const price = effectivePrice(product);
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card block transition duration-300 hover:-translate-y-[5px] hover:shadow-[0_18px_55px_rgba(89,47,31,0.11)]"
    >
      <div className="relative aspect-[7/10] overflow-hidden bg-[#f7e7d7]">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <Placeholder />
        )}
        <span className="absolute left-3 top-3 bg-[rgba(255,252,247,0.92)] px-2.5 py-1.5 text-[9px] uppercase tracking-[1px] text-wine">
          {hasDiscount ? "Offer" : product.fabric || "Signature"}
        </span>
      </div>
      <div className="space-y-2 p-5">
        <p className="text-[9px] uppercase tracking-[1.6px] text-[#a26c34]">
          {[product.fabric, product.color].filter(Boolean).join(" · ") ||
            "Label Vihana"}
        </p>
        <h3 className="font-serif text-2xl font-semibold leading-tight text-wine">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-sm font-semibold text-ink">{formatUSD(price)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through">
              {formatUSD(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
