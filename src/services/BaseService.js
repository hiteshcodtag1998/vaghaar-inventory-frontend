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

const BaseService = {
  request: async (url, method = "GET", data = null, options = {}) => {
    try {
      const response = await axiosInstance({
        url,
        method,
        data,
        ...options,
        headers: {
          ...axiosInstance.defaults.headers,
          ...options.headers,
        },
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      console.log("Message", message);

      if (message === "Access Denied. No token provided.") {
        window.location.replace("/login");
      }

      throw new Error(message);
    }
  },
};

export default BaseService;
