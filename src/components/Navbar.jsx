import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    try {
      await logout();
      navigate("/");
    } catch {
      // local session is cleared by the context regardless
    }
  }

  const linkClass = ({ isActive }) =>
    `relative text-[11px] font-semibold uppercase tracking-[0.8px] transition after:absolute after:bottom-[-8px] after:left-0 after:h-px after:bg-gold after:transition-all hover:text-wine ${
      isActive ? "text-wine after:right-0" : "text-brown/80 after:right-full"
    }`;

  return (
    <>
      <div className="flex min-h-[38px] items-center justify-center gap-3 bg-wine px-[5vw] py-2 text-center text-[11px] tracking-[0.8px] text-orange-50">
        <span className="hidden sm:inline">Custom Designs</span>
        <span className="hidden sm:inline">•</span>
        <span>Shipping Across USA · Canada · UK</span>
        <span>•</span>
        <a href="tel:+15134103705" className="font-semibold">
          513-410-3700
        </a>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
        <div className="grid h-[78px] grid-cols-[1fr_auto] items-center gap-5 px-5 md:h-[92px] md:grid-cols-[minmax(250px,1fr)_auto_minmax(130px,0.45fr)] md:px-[5vw]">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img
              src="/assets/logo.jpg"
              alt="Label Vihana floral logo"
              className="h-14 w-14 rounded-full border border-[#ecd9bd] object-cover"
            />
            <span className="flex min-w-0 flex-col">
              <b className="font-serif text-xl font-semibold leading-none tracking-[2px] text-wine md:text-2xl">
                LABEL VIHANA
              </b>
              <small className="mt-1.5 truncate text-[11px] text-brown">
                సంప్రదాయానికి కొత్త అందం
              </small>
            </span>
          </Link>

          <nav
            className={`absolute left-0 right-0 top-[78px] z-40 flex-col items-start gap-6 border-b border-line bg-paper px-6 py-6 shadow-lg md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
              menuOpen ? "flex" : "hidden"
            }`}
            aria-label="Main navigation"
          >
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>
              Collections
            </NavLink>
            <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
              Cart{count > 0 ? ` (${count})` : ""}
            </NavLink>
            {user ? (
              <button
                onClick={handleLogout}
                className="relative text-left text-[11px] font-semibold uppercase tracking-[0.8px] text-brown/80 transition after:absolute after:bottom-[-8px] after:left-0 after:right-full after:h-px after:bg-gold after:transition-all hover:text-wine hover:after:right-0"
              >
                Logout{user.firstName ? ` · ${user.firstName}` : ""}
              </button>
            ) : (
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            )}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link
              to="/cart"
              className="relative hidden rounded-md p-2 text-wine transition hover:bg-peach-soft/60 md:block"
              aria-label={`Cart with ${count} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            <Link
              to="/login"
              className="hidden rounded-full bg-wine px-[17px] py-3 text-[10px] uppercase tracking-[1px] text-white transition hover:bg-wine-dark lg:block"
            >
              Shop Now
            </Link>

            <button
              className="border-0 bg-none p-1 text-2xl leading-none text-wine md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
