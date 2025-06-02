import BaseService from "./BaseService";

const prefix = "warehouse";

const WarehouseService = {
  add: (form, role, requestBy) => {
    const headers = {
      role,
      requestBy,
    };
    return BaseService.request(`${prefix}/add`, "POST", form, { headers });
  },

  update: (form, role, requestBy) => {
    const headers = {
      role,
      requestBy,
    };
    return BaseService.request(`${prefix}/update`, "POST", form, { headers });
  },

  getAll: (role, userId) => {
    const headers = { role };
    if (userId) headers.requestBy = userId;
    return BaseService.request(`${prefix}/get`, "GET", null, { headers });
  },
};

export default WarehouseService;
