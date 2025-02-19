import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Request Interceptor: Attach Token to Every Request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // if (config.url && config.url.includes("/api/auth/login")) {
    //     localStorage.removeItem("token");
    //     return config; // Don't modify headers for login requests
    //   }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor: Handle Expired Token (401)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expired. Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
