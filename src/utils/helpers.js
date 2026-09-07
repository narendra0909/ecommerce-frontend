import { BACKEND_ORIGIN } from "../api/client";

export function formatUSD(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function effectivePrice(product) {
  return product?.discountPrice ?? product?.price ?? 0;
}

export function getProductImages(product) {
  return (product?.images ?? [])
    .map((img) => resolveImageUrl(typeof img === "string" ? img : img?.url))
    .filter(Boolean);
}

function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.message).join(", ");
  }
  return fallback;
}
