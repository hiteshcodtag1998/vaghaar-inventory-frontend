import BaseService from "./BaseService";

const prefix = "product";

const ProductService = {
  add: (products, role, requestBy) =>
    BaseService.request(`${prefix}/add`, "POST", products, {
      headers: {
        role,
        requestBy,
        "Content-Type": "application/json",
      },
    }),

  // Fetch all products
  getAll: (role) =>
    BaseService.request(`${prefix}/get`, "GET", null, {
      headers: { role },
    }),

  // Fetch total product counts
  getTotalCounts: (role, warehouse = "") =>
    BaseService.request(
      `${prefix}/get-total-counts?selectWarehouse=${warehouse}`,
      "GET",
      null,
      {
        headers: { role },
      }
    ),

  // Search products
  search: (role, searchTerm, selectWarehouse = "") =>
    BaseService.request(
      `${prefix}/search?searchTerm=${searchTerm}&selectWarehouse=${selectWarehouse}`,
      "GET",
      null,
      {
        headers: { role },
      }
    ),

  // Get products by warehouse
  getByWarehouse: (role, searchTerm = "", selectWarehouse = "") =>
    BaseService.request(
      `${prefix}/search?selectWarehouse=${selectWarehouse}&searchTerm=${searchTerm}`,
      "GET",
      null,
      {
        headers: { role },
      }
    ).then((data) =>
      data?.map((d) => {
        if (d?.productID) {
          return {
            ...d,
            name: d.productID.name,
            productCode: d.productID.productCode,
            description: d.productID.description,
          };
        }
        return d;
      })
    ),
};

export default ProductService;
