// services/TransferStockService.js

import BaseService from "./BaseService";

const prefix = "transferstock";

const TransferStockService = {
  add: (data, role, requestBy) =>
    BaseService.request(`${prefix}/add`, "POST", data, {
      headers: {
        role,
        requestBy,
      },
    }),

  getAll: (role, requestBy) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: { role, requestBy },
    }),

  downloadPDF: (data) =>
    BaseService.request(`${prefix}/transfterstock-pdf-download`, "POST", data, {
      responseType: "arraybuffer",
    }),
};

export default TransferStockService;
