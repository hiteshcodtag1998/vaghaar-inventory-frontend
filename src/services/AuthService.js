// src/services/AuthService.js

import BaseService from "./BaseService";

const prefix = "auth";

const AuthService = {
  me: () => BaseService.request(`${prefix}/me`),
  login: (formData) => BaseService.request(`${prefix}/login`, "POST", formData),
  logout: (role) =>
    BaseService.request(`${prefix}/logout`, "GET", null, {
      headers: {
        role,
        "Content-Type": "application/json",
      },
    }),
  getUserProfile: () => BaseService.request(`${prefix}/profile`),
};

export default AuthService;
