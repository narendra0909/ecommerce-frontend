import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/helpers";

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    location.state?.from ? "Admin access required." : null
  );
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginAdmin(form);
      navigate(location.state?.from?.pathname ?? "/admin/products", {
        replace: true,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid admin credentials."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wine-dark px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/assets/logo.jpg"
            alt="Label Vihana logo"
            className="mb-5 h-20 w-20 rounded-full border border-white/30 object-cover shadow-xl"
          />
          <Link to="/" className="font-serif text-2xl font-semibold tracking-[2px] text-white">
            LABEL VIHANA{" "}
            <span className="align-middle text-[9px] font-sans font-semibold uppercase tracking-[2px] text-gold">
              Admin
            </span>
          </Link>
          <span className="mt-1 text-xs text-peach-soft">సంప్రదాయానికి కొత్త అందం</span>
        </div>

        {error && (
          <p className="mb-4 bg-red-900/40 p-3 text-sm text-red-100 ring-1 ring-red-300/40">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 bg-paper p-7 shadow-2xl">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-xs uppercase tracking-[1px] text-white/60">
          <Link to="/" className="transition hover:text-gold">
            ← Back to store
          </Link>
          <Link to="/admin/register" className="transition hover:text-gold">
            Create admin account →
          </Link>
        </div>
      </div>
    </div>
  );
}
