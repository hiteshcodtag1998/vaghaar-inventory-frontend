// src/services/BaseService.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hold a navigation callback
let navigateToLogin = null;

const BaseService = {
  setNavigateToLogin: (navigateFn) => {
    navigateToLogin = navigateFn;
  },

  request: async (url, method = "GET", data = null, options = {}) => {
    try {
      const response = await axiosInstance({
        url,
        method,
        ...(method === "GET" ? {} : { data }),
        ...options,
        headers: {
          ...axiosInstance.defaults.headers,
          ...options.headers,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Full error:", error);
      console.error("Response data:", error?.response?.data);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      if (
        message === "Access Denied. No token provided." ||
        message === "Unauthorized"
      ) {
        if (typeof navigateToLogin === "function") {
          navigateToLogin();
        }
      }

      throw new Error(message);
    }
  },
};

export default BaseService;
