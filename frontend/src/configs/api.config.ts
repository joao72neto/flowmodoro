import axios from "axios";
import { getAnonymousUserId } from "../shared/utils/local-storage.utils";
import { handleApiError } from "./api-error.config";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const userId = getAnonymousUserId();
  config.headers["X-User-Id"] = userId;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    handleApiError(error);
  },
);

export default api;
