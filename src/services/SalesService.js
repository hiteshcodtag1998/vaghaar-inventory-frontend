import BaseService from "./BaseService";

const prefix = "sales";

const SalesService = {
  // Get all sales
  getAll: (role, requestBy) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: {
        role,
        requestBy,
      },
    }),

  // Get total sales amount
  getTotalSaleAmount: () =>
    BaseService.request(`${prefix}/get/totalsaleamount`, "GET"),

  // Get monthly sales data for chart
  getMonthlySalesData: () => BaseService.request(`${prefix}/getmonthly`, "GET"),

  downloadPDF: (data) =>
    BaseService.request(`${prefix}/sale-pdf-download`, "POST", data, {
      responseType: "arraybuffer",
    }),

  deleteById: (id, role) =>
    BaseService.request(`${prefix}/delete/${id}`, "DELETE", {
      headers: { role },
    }),
};

export default SalesService;
