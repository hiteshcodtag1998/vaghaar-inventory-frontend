import BaseService from "./BaseService";

const prefix = "product";

const ProductService = {
  // Fetch all products
  getAll: (role) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: { role },
    }),
};

export default ProductService;
