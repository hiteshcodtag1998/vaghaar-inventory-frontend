import BaseService from "./BaseService";

const prefix = "store";

const StoreService = {
  // Fetch all stores
  getAll: () => BaseService.request(`${prefix}/get`, "GET"),
};

export default StoreService;
