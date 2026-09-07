import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/helpers";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(form);
      const from =
        location.state?.from?.pathname ??
        (user.role === "ADMIN" ? "/admin/products" : "/");
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-38px)] lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-[linear-gradient(110deg,#fffaf5_0%,#fceddf_55%,#f3d7c3_100%)] lg:block">
        <span aria-hidden className="absolute left-10 top-16 select-none text-7xl text-peach opacity-50">
          ✿
        </span>
        <div className="flex h-full flex-col justify-center px-[8vw]">
          <img
            src="/assets/logo.jpg"
            alt="Label Vihana logo"
            className="mb-8 h-20 w-20 rounded-full border border-[#ecd9bd] object-cover shadow-lg"
          />
          <p className="eyebrow">Tradition Reimagined · Elegance Redefined</p>
          <h2 className="mt-4 font-serif text-5xl font-semibold leading-tight text-wine">
            Welcome back to
            <br />
            <em className="font-medium text-brown">beautiful moments.</em>
          </h2>
          <p className="mt-5 max-w-md font-serif text-lg font-medium leading-relaxed text-[#5c4d45]">
            Log in to explore timeless sarees and festive wear, thoughtfully
            curated by Label Vihana.
          </p>
          <div className="mt-8 flex gap-8">
            <span className="border-l border-[#d8b296] pl-4 text-[10px] uppercase tracking-[1px] text-muted">
              USA · Canada · UK
            </span>
            <span className="border-l border-[#d8b296] pl-4 text-[10px] uppercase tracking-[1px] text-muted">
              Custom designs
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <img
            src="/assets/logo.jpg"
            alt="Label Vihana logo"
            className="mb-6 h-14 w-14 rounded-full border border-[#ecd9bd] object-cover lg:hidden"
          />
          <p className="eyebrow">Customer Login</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-wine">
            Sign in
          </h1>

          {error && (
            <p className="mt-6 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-7">
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
                placeholder="you@example.com"
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
                placeholder="••••••••"
                className="input"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            New to Label Vihana?{" "}
            <Link to="/register" className="font-semibold text-wine underline decoration-gold decoration-1 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
