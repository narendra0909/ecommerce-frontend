import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl text-peach/50">✿</span>
      <p className="mt-6 font-serif text-7xl font-semibold text-peach-soft">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-wine">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
