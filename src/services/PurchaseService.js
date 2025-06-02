import BaseService from "./BaseService";

const prefix = "purchase";

const PurchaseService = {
  // Fetch all purchases
  getAll: (role, userId) => {
    const headers = {
      role,
    };
    if (userId) headers.requestBy = userId;

    return BaseService.request(`${prefix}/get`, "GET", null, { headers });
  },

  downloadPDF: (data) =>
    BaseService.request(`${prefix}/purchase-pdf-download`, "POST", data, {
      responseType: "arraybuffer",
    }),

  // Get total purchase amount
  getTotalPurchaseAmount: () =>
    BaseService.request(`${prefix}/get/totalpurchaseamount`, "GET", null),

  // Example: Add purchase (if needed)
  add: (purchaseData, role, requestBy) => {
    const headers = {
      role,
      requestBy,
      "Content-Type": "application/json",
    };
    return BaseService.request(`${prefix}/add`, "POST", purchaseData, {
      headers,
    });
  },
};

export default PurchaseService;
