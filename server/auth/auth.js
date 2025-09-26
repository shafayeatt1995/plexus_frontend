import apiFetch from "../apiFetch";

export async function apiLogin(body) {
  return apiFetch.post(`/auth/login`, body);
}
export async function apiRefreshToken(body) {
  return apiFetch.post(`/auth/refresh-token`, body);
}
