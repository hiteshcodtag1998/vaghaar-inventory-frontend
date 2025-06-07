// src/services/HistoryService.js
import BaseService from "./BaseService";

const prefix = "history";

const HistoryService = {
  getAll: (role, requestBy) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: { role, requestBy },
    }),

  deleteById: (id, role) =>
    BaseService.request(`${prefix}/delete/${id}`, "DELETE", null, {
      headers: { role },
    }),
};

export default HistoryService;
