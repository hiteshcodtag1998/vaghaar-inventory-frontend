// src/services/BaseService.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BaseService = {
  request: async (url, method = "GET", data = null, options = {}) => {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Important to send cookies (JWT in HttpOnly cookie)
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default BaseService;
