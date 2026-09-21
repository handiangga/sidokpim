import api from "./api";

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
}

export async function getProfile() {
  const response = await api.get("/auth/me");
  return response.data.data;
}

export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}
