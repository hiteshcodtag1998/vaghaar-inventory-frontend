// services/WriteOffService.js
import BaseService from "./BaseService";

const prefix = "writeoff";

const WriteOffService = {
  add: (data, role, requestBy) =>
    BaseService.request(`${prefix}/add`, "POST", data, {
      headers: {
        role,
        requestBy,
      },
    }),

  update: (data, role, requestBy) =>
    BaseService.request(`${prefix}/update`, "POST", data, {
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
    BaseService.request(`${prefix}/writeOff-pdf-download`, "POST", data, {
      responseType: "arraybuffer",
    }),

  downloadMultipleItemsPDF: (data) =>
    BaseService.request(
      `${prefix}/sale-multipleitems-pdf-download`,
      "POST",
      data,
      {
        responseType: "arraybuffer",
      }
    ),

  deleteById: (id, role) =>
    BaseService.request(`${prefix}/delete/${id}`, "DELETE", null, {
      headers: { role },
    }),
};

export default WriteOffService;
