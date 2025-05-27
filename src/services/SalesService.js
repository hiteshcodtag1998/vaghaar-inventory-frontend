import BaseService from "./BaseService";

const prefix = "sales";

const SalesService = {
  // Get total sales amount
  getTotalSaleAmount: () =>
    BaseService.request(`${prefix}/get/totalsaleamount`),

  // Get monthly sales data for chart
  getMonthlySalesData: () => BaseService.request(`${prefix}/getmonthly`),

  // You can add more sales related APIs here
};

export default SalesService;
