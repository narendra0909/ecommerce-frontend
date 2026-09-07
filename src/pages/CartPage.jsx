import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatUSD } from "../utils/helpers";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <span className="text-6xl text-peach/50">✿</span>
        <p className="mt-6 font-serif text-4xl font-semibold text-wine">
          Your cart is empty
        </p>
        <p className="mt-3 font-serif text-lg text-muted">
          Explore our collection and add something you love.
        </p>
        <Link to="/products" className="btn-primary mt-8">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="eyebrow">Your Selection</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-wine">Shopping Cart</h1>

      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="card flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
            <div className="min-w-48 flex-1">
              <Link
                to={`/products/${item.slug}`}
                className="font-serif text-xl font-semibold text-wine hover:text-brown"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-xs text-muted">
                {formatUSD(item.discountPrice ?? item.price)} each
              </p>
            </div>

            <div className="flex items-center border border-line bg-white">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="px-3.5 py-2 text-brown transition hover:text-wine"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                className="px-3.5 py-2 text-brown transition hover:text-wine"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right font-semibold text-wine">
              {formatUSD((item.discountPrice ?? item.price) * item.qty)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-[10px] font-semibold uppercase tracking-[1px] text-red-700 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="card mt-8 p-7">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[1px] text-muted">
            Subtotal
          </span>
          <span className="font-serif text-3xl font-semibold text-wine">
            {formatUSD(subtotal)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          Shipping, taxes and payment options will be added at checkout.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/products" className="btn-secondary">
            Continue Shopping
          </Link>
          <button className="btn-primary" disabled title="Coming soon — order APIs not built yet">
            Proceed to Checkout (soon)
          </button>
          <button
            onClick={clearCart}
            className="ml-auto self-center text-[10px] font-semibold uppercase tracking-[1px] text-red-700 hover:underline"
          >
            Clear cart
          </button>
        </div>
      </div>
    </div>
  );
}
