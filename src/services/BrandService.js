// src/services/BrandService.js
import BaseService from "./BaseService";

const prefix = "brand";

const BrandService = {
  add: (brand, role) =>
    BaseService.request(`${prefix}/add`, "POST", brand, {
      headers: {
        role,
        "Content-Type": "application/json",
      },
    }),

  getAll: (role) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: { role },
    }),
};

export default BrandService;
