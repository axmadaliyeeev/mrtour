import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ── Request: attach JWT ────────────────────────────────
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("mrtour-token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ── Response: unwrap { success, data } wrapper ─────────
instance.interceptors.response.use(
  (response) => {
    // Backend always returns { success: true, data: ... }
    // Unwrap so callers get the actual data directly
    if (response.data?.success !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
      return instance(original);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mrtour-token");
      }
      return Promise.reject(error);
    }
  }
);

// ── Typed convenience methods ─────────────────────────
export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get<T>(url, config).then((r) => r.data as T);
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.post<T>(url, data, config).then((r) => r.data as T);
  },
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.patch<T>(url, data, config).then((r) => r.data as T);
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete<T>(url, config).then((r) => r.data as T);
  },
};
