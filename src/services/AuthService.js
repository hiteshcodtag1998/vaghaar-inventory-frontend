// src/services/AuthService.js

import BaseService from "./BaseService";

const prefix = "auth";

const AuthService = {
  me: () => BaseService.request(`${prefix}/me`),
  login: (formData) => BaseService.request(`${prefix}/login`, "POST", formData),
  logout: () => BaseService.request(`${prefix}/logout`, "POST"),
  getUserProfile: () => BaseService.request(`${prefix}/profile`),
};

export default AuthService;
