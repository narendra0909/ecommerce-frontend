import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { getApiErrorMessage } from "../utils/helpers";

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
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
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName || undefined,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col px-6 py-16">
      <div className="text-center">
        <img
          src="/assets/logo.jpg"
          alt="Label Vihana logo"
          className="mx-auto mb-5 h-16 w-16 rounded-full border border-[#ecd9bd] object-cover shadow"
        />
        <p className="eyebrow">Join Label Vihana</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-wine">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          For a personalized shopping experience.
        </p>
      </div>

      {error && (
        <p className="mt-6 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-7">
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

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-wine underline decoration-gold decoration-1 underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
