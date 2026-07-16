import axios from "axios";
import { store } from "@/store";
import { addToast } from "@/store/slices/uiSlice";

export const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiService.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success && response.data.message) {
      store.dispatch(
        addToast({ type: "success", message: response.data.message }),
      );
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("accessToken");
      store.dispatch({ type: "auth/logout" });
    }

    const backendMessage: string =
      error.response?.data?.message ||
      error.message ||
      "A network or server error occurred.";

    store.dispatch(addToast({ type: "error", message: backendMessage }));

    return Promise.reject(error);
  },
);
