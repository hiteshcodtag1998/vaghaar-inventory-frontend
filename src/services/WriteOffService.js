// services/WriteOffService.js
import BaseService from "./BaseService";

const prefix = "writeoff";

const WriteOffService = {
  getAll: (role, requestBy) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: { role, requestBy },
    }),

  downloadPDF: (data) =>
    BaseService.request(`${prefix}/writeOff-pdf-download`, "POST", data, {
      responseType: "arraybuffer",
    }),

  deleteById: (id, role) =>
    BaseService.request(`${prefix}/delete/${id}`, "DELETE", null, {
      headers: { role },
    }),
};

export default WriteOffService;
