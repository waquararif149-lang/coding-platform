import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Automatically attach JWT token to every request if present
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to normalize error messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject(new Error("Network error. Please check if the server is running."));
        }

        const status = error.response.status;
        const serverMessage = error.response.data?.message;

        if (status === 401) {
            // Unauthenticated
            const customError = new Error(serverMessage || "Please login again.");
            customError.status = 401;
            return Promise.reject(customError);
        }

        if (status === 403) {
            // Forbidden / Permission / Exam Access issue
            const customError = new Error(serverMessage || "You do not have permission to perform this action.");
            customError.status = 403;
            return Promise.reject(customError);
        }

        if (status === 404) {
            const customError = new Error(serverMessage || "Resource not found.");
            customError.status = 404;
            return Promise.reject(customError);
        }

        if (status >= 500) {
            const customError = new Error(serverMessage || "Something went wrong. Please try again.");
            customError.status = status;
            return Promise.reject(customError);
        }

        const customError = new Error(serverMessage || "An error occurred.");
        customError.status = status;
        return Promise.reject(customError);
    }
);

export default api;