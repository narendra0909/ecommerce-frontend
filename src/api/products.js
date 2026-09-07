import api from "./client";

export async function fetchProducts() {
  const res = await api.get("/products");
  return res.data.data.products ?? [];
}

export async function fetchProductBySlug(slug) {
  const res = await api.get(`/products/${encodeURIComponent(slug)}`);
  return res.data.data.product;
}

function buildProductFormData(values, imageFiles) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value === null || value === "") {
      formData.append(key, "null");
    } else {
      formData.append(key, String(value));
    }
  });
  if (imageFiles) {
    imageFiles.forEach((file) => formData.append("images", file));
  }
  return formData;
}

export async function createProduct(values, imageFiles) {
  const res = await api.post(
    "/admin/products",
    buildProductFormData(values, imageFiles)
  );
  return res.data.data.product;
}

export async function updateProduct(id, values, imageFiles) {
  const res = await api.patch(
    `/admin/products/${id}`,
    buildProductFormData(values, imageFiles)
  );
  return res.data.data.product;
}
