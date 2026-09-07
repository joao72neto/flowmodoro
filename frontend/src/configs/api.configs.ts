import axios from "axios";
import { handleApiError } from "./api-error.configs";
import { supabase } from "./supabase.configs";

export const AUTH_EXPIRED_EVENT = "auth:expired";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 120000,
});

api.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to retrieve Supabase session token", error);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError || !data.session) {
          window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
          return Promise.reject(error);
        }

        originalRequest.headers["Authorization"] =
          `Bearer ${data.session.access_token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
        console.error("Failed to refresh Supabase session", refreshErr);
        return Promise.reject(error);
      }
    }

    handleApiError(error);
    return Promise.reject(error);
  },
);

export default api;
