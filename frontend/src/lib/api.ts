import axios from "axios";

// Use a fallback URL if the environment variable is not set
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Only add the interceptor when running in the browser
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);

    // Handle authentication errors
    if (
      error.response &&
      error.response.status === 401 &&
      typeof window !== "undefined"
    ) {
      console.log("Authentication failed, redirecting to login");
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
