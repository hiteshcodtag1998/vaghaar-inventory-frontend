import BaseService from "./BaseService";

const prefix = "purchase";

const PurchaseService = {
  // Get total purchase amount
  getTotalPurchaseAmount: () =>
    BaseService.request(`${prefix}/get/totalpurchaseamount`),

  // You can add more purchase related APIs here
};

export default PurchaseService;
