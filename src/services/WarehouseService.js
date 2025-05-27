import BaseService from "./BaseService";

const prefix = "warehouse";

const WarehouseService = {
  // Fetch all warehouses
  getAll: (role) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: { role },
    }),
};

export default WarehouseService;
