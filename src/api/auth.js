import api, { setAccessToken } from "./client";

export async function registerUser(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function loginUser({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  setAccessToken(res.data.data.accessToken);
  return res.data.data.user;
}

export async function loginAdmin({ email, password }) {
  const res = await api.post("/admin/login", { email, password });
  setAccessToken(res.data.data.accessToken);
  return res.data.data.user;
}

export async function registerAdmin({ firstName, lastName, email, password, adminSecret }) {
  const res = await api.post("/admin/register", {
    firstName,
    lastName: lastName || undefined,
    email,
    password,
    adminSecret,
  });
  return res.data;
}

export async function logoutRequest(isAdmin) {
  const path = isAdmin ? "/admin/logout" : "/auth/logout";
  const res = await api.post(path);
  return res.data;
}

export async function fetchMyProfile() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function adminPing() {
  const res = await api.get("/admin/ping");
  return res.data;
}
