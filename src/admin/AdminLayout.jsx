import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItem = ({ isActive }) =>
  `block px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[1.2px] transition ${
    isActive
      ? "bg-wine text-white"
      : "text-brown hover:bg-peach-soft/50 hover:text-wine"
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/admin/login");
    }
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper p-4 sm:flex">
        <Link to="/" className="mb-8 flex items-center gap-3 px-2 pt-2">
          <img
            src="/assets/logo.jpg"
            alt="Label Vihana logo"
            className="h-12 w-12 rounded-full border border-[#ecd9bd] object-cover"
          />
          <span className="flex flex-col">
            <span className="font-serif text-lg font-semibold leading-none tracking-[1.5px] text-wine">
              LABEL VIHANA
            </span>
            <small className="mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-gold">
              Admin
            </small>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          <NavLink to="/admin/products" end className={navItem}>
            Products
          </NavLink>
          <NavLink to="/admin/products/new" className={navItem}>
            + New Product
          </NavLink>
        </nav>

        <div className="space-y-3 border-t border-line pt-4">
          <p className="px-3 text-[11px] text-muted">
            Signed in as
            <br />
            <span className="font-medium text-brown">{user?.email}</span>
          </p>
          <button onClick={handleLogout} className="btn-secondary w-full">
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-line bg-paper px-5 sm:hidden">
          <Link to="/admin" className="font-serif text-lg font-semibold tracking-wide text-wine">
            LABEL VIHANA{" "}
            <span className="align-middle font-sans text-[8px] font-semibold uppercase tracking-[2px] text-gold">
              Admin
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-[10px] font-semibold uppercase tracking-[1px] text-brown"
          >
            Logout
          </button>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b border-line bg-paper px-4 py-2 sm:hidden">
          <NavLink to="/admin/products" end className={navItem}>
            Products
          </NavLink>
          <NavLink to="/admin/products/new" className={navItem}>
            + New Product
          </NavLink>
        </nav>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
