import axios, { AxiosRequestConfig, AxiosError } from "axios";

// Extend Axios config to mark retries
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

// "https://project-file-management-system.onrender.com/api/v1"

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5001/api/v1", 
  withCredentials: true, // send cookies automatically
});

// Response interceptor for handling 401 (access token expired)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint; cookies are sent automatically
        await axios.post(
        `http://localhost:5001/api/v1/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError: unknown) {
        if (refreshError instanceof AxiosError) {
          console.error("Refresh token expired or invalid", refreshError);

          // Redirect to login if refresh token failed
          if (refreshError.response?.status === 401) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
