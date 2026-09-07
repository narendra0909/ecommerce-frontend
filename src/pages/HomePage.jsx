import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import FullPageSpinner from "../components/FullPageSpinner";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => !cancelled && setProducts(data.slice(0, 8)))
      .catch(() => !cancelled && setError("Unable to load the collection right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="grid overflow-hidden bg-[linear-gradient(110deg,#fffaf5_0%,#fceddf_55%,#f3d7c3_100%)] lg:grid-cols-[1.03fr_0.97fr]">
        <div className="relative px-6 pb-16 pt-16 sm:px-10 lg:py-28 lg:pl-[8vw]">
          <span aria-hidden className="pointer-events-none absolute left-4 top-12 hidden select-none text-7xl text-peach opacity-50 lg:block">
            ✿
          </span>
          <p className="eyebrow">Tradition Reimagined · Elegance Redefined</p>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-wine sm:text-6xl lg:text-7xl">
            Made for your
            <br />
            <em className="font-medium text-brown">beautiful moments.</em>
          </h1>
          <p className="mt-6 max-w-xl font-serif text-lg font-medium leading-relaxed text-[#5c4d45] sm:text-xl">
            Timeless sarees, elegant festive wear and custom outfits thoughtfully
            chosen for celebrations, family moments and everyday grace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:flex-row sm:items-center">
            <Link to="/products" className="btn-primary">
              Explore Collection
            </Link>
            <Link to="/login" className="btn-secondary">
              Shop Your Account
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-5 sm:grid-cols-3">
            {[
              ["Custom", "Made for you"],
              ["Premium", "Thoughtfully selected"],
              ["International", "USA · Canada · UK"],
            ].map(([strong, small]) => (
              <div key={strong} className="border-l border-[#d8b296] pl-4">
                <strong className="block font-serif text-lg font-semibold text-wine">
                  {strong}
                </strong>
                <span className="mt-1 block text-[10px] text-muted">{small}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-[radial-gradient(circle_at_35%_20%,#fff7ee_0%,#ead0ba_70%)] lg:min-h-[680px]">
          <img
            src="/assets/hero-saree.png"
            alt="Elegant peach traditional saree"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,249,243,0.2),transparent_28%,rgba(90,22,50,0.08))]" />
          <span aria-hidden className="absolute right-7 top-6 select-none text-8xl text-orange-50 opacity-60">
            ✿
          </span>
          <div className="absolute bottom-7 left-7 min-w-[240px] bg-wine/95 p-5 text-white shadow-[0_18px_55px_rgba(89,47,31,0.25)]">
            <small className="mb-2 block text-[9px] tracking-[2px] text-gold">
              LABEL VIHANA
            </small>
            <strong className="font-serif text-[22px] font-semibold leading-tight">
              Beautifully traditional.
              <br />
              Uniquely yours.
            </strong>
          </div>
        </div>
      </section>

      {/* Signature band */}
      <div className="flex justify-center gap-6 overflow-auto whitespace-nowrap bg-[#f7dccc] px-[5vw] py-3.5 text-[10px] font-semibold tracking-[2px] text-wine">
        <span>SAREES</span>
        <i className="text-gold not-italic">✦</i>
        <span>FESTIVE WEAR</span>
        <i className="text-gold not-italic">✦</i>
        <span>CUSTOM DESIGNS</span>
        <i className="text-gold not-italic">✦</i>
        <span>MADE WITH LOVE</span>
      </div>

      {/* Featured */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-[7vw]">
        <div className="text-center">
          <p className="eyebrow">Curated by Label Vihana</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-wine sm:text-5xl">
            Indian elegance with a
            <br />
            <em className="font-medium text-brown">modern point of view.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-lg font-medium text-muted">
            Our collection blends classic craftsmanship, graceful colors and
            wearable silhouettes — browse what's in stock below.
          </p>
        </div>

        <div className="mt-12">
          {loading ? (
            <FullPageSpinner label="Loading collection…" />
          ) : error ? (
            <p className="bg-red-50 p-4 text-sm text-red-700">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center font-serif text-lg text-muted">
              New pieces are being added soon. Check back shortly ✿
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {!loading && !error && products.length > 0 && (
          <div className="mt-10 text-center">
            <Link to="/products" className="btn-secondary inline-flex">
              View Full Collection →
            </Link>
          </div>
        )}
      </section>

      {/* Delivery band */}
      <section className="grid gap-5 border-y border-[#e8c9b6] bg-[#f5decf] px-6 py-8 text-center sm:grid-cols-3 lg:px-[7vw]">
        {["USA", "Canada", "United Kingdom"].map((country, i) => (
          <div key={country} className={i < 2 ? "sm:border-r sm:border-[#dfbfa9]" : ""}>
            <span className="mr-2 text-gold">✦</span>
            <strong className="font-serif text-2xl font-semibold text-wine">{country}</strong>
            <small className="mt-1 block text-xs text-muted">Shipping available</small>
          </div>
        ))}
      </section>
    </>
  );
}
