import axios from "axios";
import { getAnonymousUserId } from "../shared/utils/local-storage.utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const userId = getAnonymousUserId();
  config.headers["X-User-Id"] = userId;
  return config;
});

export default api;
