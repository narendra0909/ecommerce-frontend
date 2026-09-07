import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { createProduct, fetchProducts, updateProduct } from "../api/products";
import { getApiErrorMessage } from "../utils/helpers";
import FullPageSpinner from "../components/FullPageSpinner";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "0",
  fabric: "",
  color: "",
  careInstructions: "",
  status: "PUBLISHED",
};

const MAX_IMAGES = 6;

export default function AdminProductFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    const fromState = location.state?.product;
    if (fromState && fromState.id === id) {
      hydrate(fromState);
      return;
    }

    let cancelled = false;
    // Fallback: locate the product in the public list by id.
    fetchProducts()
      .then((products) => {
        if (cancelled) return;
        const product = products.find((p) => p.id === id);
        if (product) {
          hydrate(product);
        } else {
          setError(
            "Product not found among published items. If it is a DRAFT, an admin list endpoint on the backend is needed to edit it."
          );
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Unable to load the product."));
          setLoading(false);
        }
      });

    function hydrate(product) {
      setForm({
        title: product.title ?? "",
        description: product.description ?? "",
        price: String(product.price ?? ""),
        discountPrice:
          product.discountPrice == null ? "" : String(product.discountPrice),
        stock: String(product.stock ?? 0),
        fabric: product.fabric ?? "",
        color: product.color ?? "",
        careInstructions: product.careInstructions ?? "",
        status: product.status ?? "PUBLISHED",
      });
      setExistingImages(product.images ?? []);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, location.state]);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [files]
  );

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES);
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setFiles(selected);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.fabric.trim() || !form.color.trim()) {
      setError("Title, fabric and color are required.");
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    const discountPrice =
      form.discountPrice === "" ? null : Number(form.discountPrice);
    if (
      discountPrice != null &&
      (!Number.isFinite(discountPrice) || discountPrice >= price)
    ) {
      setError("Discount price must be lower than the regular price.");
      return;
    }
    if (!isEdit && form.description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price,
      discountPrice,
      stock: Number(form.stock) || 0,
      fabric: form.fabric,
      color: form.color,
      status: form.status,
    };
    if (form.careInstructions.trim()) {
      payload.careInstructions = form.careInstructions;
    } else if (isEdit) {
      payload.careInstructions = null; // clears the field server-side
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateProduct(id, payload, files.length > 0 ? files : undefined);
      } else {
        await createProduct(payload, files.length > 0 ? files : undefined);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to save the product."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FullPageSpinner label="Loading piece…" />;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          to="/admin/products"
          className="text-[10px] font-semibold uppercase tracking-[1px] text-muted hover:text-wine"
        >
          ← Back to products
        </Link>
        <p className="eyebrow mt-3">{isEdit ? "Edit Piece" : "Add New Piece"}</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-wine">
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
      </div>

      {error && (
        <p className="mb-4 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5 p-7">
        <div>
          <label htmlFor="title" className="label">
            Title *
          </label>
          <input
            id="title"
            name="title"
            required
            minLength={3}
            maxLength={200}
            value={form.title}
            onChange={handleChange}
            className="input"
            placeholder="Peach Gold Heritage Saree"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description *{" "}
            <span className="normal-case tracking-normal text-muted">(min 10 characters)</span>
          </label>
          <textarea
            id="description"
            name="description"
            required={!isEdit}
            rows={4}
            maxLength={5000}
            value={form.description}
            onChange={handleChange}
            className="input resize-y"
            placeholder="Elegant woven detail for celebrations…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className="label">
              Price *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="discountPrice" className="label">
              Discount price
            </label>
            <input
              id="discountPrice"
              name="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.discountPrice}
              onChange={handleChange}
              placeholder="Leave empty for none"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="stock" className="label">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="fabric" className="label">
              Fabric *
            </label>
            <input
              id="fabric"
              name="fabric"
              required
              minLength={2}
              maxLength={100}
              value={form.fabric}
              onChange={handleChange}
              placeholder="Pure Silk"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="color" className="label">
              Color *
            </label>
            <input
              id="color"
              name="color"
              required
              minLength={2}
              maxLength={50}
              value={form.color}
              onChange={handleChange}
              placeholder="Peach & Gold"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="careInstructions" className="label">
            Care instructions
          </label>
          <textarea
            id="careInstructions"
            name="careInstructions"
            rows={2}
            maxLength={500}
            value={form.careInstructions}
            onChange={handleChange}
            placeholder="Dry clean only."
            className="input resize-y"
          />
        </div>

        <div>
          <label htmlFor="images" className="label">
            Images{" "}
            <span className="normal-case tracking-normal text-muted">
              (up to {MAX_IMAGES};{" "}
              {isEdit ? "uploading replaces all existing images" : "optional"})
            </span>
          </label>

          {(existingImages.length > 0 || previews.length > 0) && (
            <div className="mb-3 flex flex-wrap gap-3">
              {previews.map((p) => (
                <img
                  key={p.name}
                  src={p.url}
                  alt=""
                  className="h-24 w-[68px] border border-line object-cover ring-2 ring-gold"
                />
              ))}
            </div>
          )}

          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full cursor-pointer rounded-sm border border-line bg-paper text-sm text-muted file:mr-3 file:cursor-pointer file:border-0 file:bg-peach-soft file:px-4 file:py-2.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide hover:file:bg-peach/30"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-6">
          <Link to="/admin/products" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
