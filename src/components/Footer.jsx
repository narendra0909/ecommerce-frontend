import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-wine-dark px-[6vw] pb-6 pt-14 text-white">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="flex items-start gap-4">
          <img
            src="/assets/logo.jpg"
            alt="Label Vihana logo"
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <strong className="font-serif text-2xl font-semibold tracking-[2px]">
              LABEL VIHANA
            </strong>
            <span className="mt-1 text-xs text-peach-soft">సంప్రదాయానికి కొత్త అందం</span>
            <small className="mt-1 text-[11px] text-white/60">
              Tradition · Elegance · Uniquely Yours
            </small>
          </div>
        </div>

        <nav className="flex flex-col gap-3 text-[11px] tracking-[0.4px]" aria-label="Footer">
          <p className="mb-1 text-[9px] uppercase tracking-[1.5px] text-gold">Shop</p>
          <Link to="/" className="transition hover:text-gold">
            Home
          </Link>
          <Link to="/products" className="transition hover:text-gold">
            Collections
          </Link>
          <Link to="/cart" className="transition hover:text-gold">
            Your Cart
          </Link>
        </nav>

        <nav className="flex flex-col gap-3 text-[11px] tracking-[0.4px]" aria-label="Account">
          <p className="mb-1 text-[9px] uppercase tracking-[1.5px] text-gold">Account</p>
          <Link to="/login" className="transition hover:text-gold">
            Login
          </Link>
          <Link to="/register" className="transition hover:text-gold">
            Create Account
          </Link>
          <Link to="/admin/login" className="transition hover:text-gold">
            Admin Portal
          </Link>
          <a href="https://www.instagram.com/labelvihana/" target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
            Instagram @labelvihana
          </a>
        </nav>
      </div>

      <p className="mt-10 border-t border-white/[0.17] pt-4 text-[10px] text-white/50">
        © {new Date().getFullYear()} Label Vihana. All rights reserved.
      </p>
    </footer>
  );
}
