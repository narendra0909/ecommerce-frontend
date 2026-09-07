import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdmin } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/helpers";

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  adminSecret: "",
};

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await registerAdmin({
        firstName: form.firstName,
        lastName: form.lastName || undefined,
        email: form.email,
        password: form.password,
        adminSecret: form.adminSecret,
      });
      // Auto-login the newly created admin.
      await loginAdmin({
        email: form.email,
        password: form.password,
      });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Admin registration failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wine-dark px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/assets/logo.jpg"
            alt="Label Vihana logo"
            className="mb-5 h-20 w-20 rounded-full border border-white/30 object-cover shadow-xl"
          />
          <Link
            to="/admin/login"
            className="font-serif text-2xl font-semibold tracking-[2px] text-white"
          >
            LABEL VIHANA{" "}
            <span className="align-middle font-sans text-[9px] font-semibold uppercase tracking-[2px] text-gold">
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
          <p className="eyebrow">Register Administrator</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="label">
                First name *
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                minLength={2}
                maxLength={100}
                value={form.firstName}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="label">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                maxLength={100}
                value={form.lastName}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email *
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
              Password *{" "}
              <span className="normal-case tracking-normal text-muted">(min 8 characters)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="adminSecret" className="label">
              Admin secret *
            </label>
            <input
              id="adminSecret"
              name="adminSecret"
              type="password"
              required
              autoComplete="off"
              value={form.adminSecret}
              onChange={handleChange}
              placeholder="System-wide registration key"
              className="input"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating admin…" : "Create Admin Account"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-xs uppercase tracking-[1px] text-white/60">
          <Link to="/admin/login" className="transition hover:text-gold">
            ← Sign in instead
          </Link>
          <Link to="/" className="transition hover:text-gold">
            Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
