import React, { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { toastMessage } from "../utils/handler";
import {
  MdEdit,
  MdDeleteForever,
  MdOutlineHideSource,
  MdAdd,
} from "react-icons/md";
import { Tooltip } from "@mui/material";
import StoreService from "../services/StoreService";
import ProductService from "../services/ProductService";
import WarehouseService from "../services/WarehouseService";
import BrandService from "../services/BrandService";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState();
  const [brands, setAllBrands] = useState([]);
  const [selectWarehouse, setSelectWarehouse] = useState();
  const [warehouses, setAllWarehouses] = useState([]);
  const [totalCounts, setTotalCounts] = useState({
    totalProductCounts: 0,
    totalItemInWarehouse: 0,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProductsData();
    fetchStoreData();
    fetchBrandData();
    fetchWarehouseData();
    fetchTotalCountsData();
  }, [updatePage]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // delay in ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    // If the user clears the search input, fetch all products
    if (debouncedSearchTerm === "") {
      fetchSearchData("");
    } else if (debouncedSearchTerm) {
      fetchSearchData(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchWarehouseData = async () => {
    try {
      const data = await WarehouseService.getAll(
        myLoginUser?.roleID?.name,
        myLoginUser?._id
      );
      setAllWarehouses(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const fetchTotalCountsData = async (warehouse = "") => {
    try {
      const data = await ProductService.getTotalCounts(
        myLoginUser?.roleID?.name,
        warehouse
      );
      setTotalCounts(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const fetchProductsData = async () => {
    try {
      const data = await ProductService.getAll(myLoginUser?.roleID?.name);
      setAllProducts(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const fetchSearchData = async (searchItem) => {
    try {
      const data = await ProductService.search(
        myLoginUser?.roleID?.name,
        searchItem,
        selectWarehouse || ""
      );
      setAllProducts(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const fetchProductByWarehouse = async (selectWarehouseVal) => {
    try {
      const data = await ProductService.getByWarehouse(
        myLoginUser?.roleID?.name,
        searchTerm || "",
        selectWarehouseVal
      );
      setAllProducts(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const fetchStoreData = async () => {
    try {
      const data = await StoreService.getAll();
      setAllStores(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  // Modal for Product ADD
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Modal for Product UPDATE
  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete item
  const deleteItem = () => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}product/delete/${selectedProduct?._id}`,
      { method: "delete", headers: { role: myLoginUser?.roleID?.name } }
    )
      .then((response) => response.json())
      .then(() => {
        setSelectedProduct();
        setUpdatePage(!updatePage);
        handleClose();
      })
      .catch(() => {
        setSelectedProduct();
        handleClose();
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle Search Term
  const handleWarehouse = (value) => {
    if (value) {
      setSelectWarehouse(value);
      fetchProductByWarehouse(value);
      fetchTotalCountsData(value);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchBrandData = async () => {
    try {
      const data = await BrandService.getAll(myLoginUser?.roleID?.name);
      setAllBrands(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const clearHandleFilter = () => {
    setSearchTerm("");
    setSelectWarehouse("");
    fetchProductsData();
    fetchTotalCountsData();
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-6 w-11/12">
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">
            Overall Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-600 font-semibold text-sm">
                Total Products
              </p>
              <p className="text-gray-700 font-medium text-base">
                {totalCounts?.totalProductCounts}
              </p>
            </div>
            <div>
              <p className="text-blue-600 font-semibold text-sm">
                Total Item In Selected Warehouse
              </p>
              <p className="text-gray-700 font-medium text-base">
                {totalCounts?.totalItemInWarehouse}
              </p>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showProductModal && (
          <AddProduct
            brands={brands}
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            brands={brands}
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
            fetchProductsData={fetchProductsData}
          />
        )}

        {/* Table Card */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 shadow-sm">
          <div className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                Products
              </span>

              {/* Search Box */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
                <img
                  alt="search-icon"
                  className="w-5 h-5 text-gray-400"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                  className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none border-0 h-full flex-1"
                />
              </div>

              {/* Select Dropdown */}
              <select
                id="fromWarehouseID"
                name="fromWarehouseID"
                value={selectWarehouse}
                onChange={(e) => handleWarehouse(e.target.value)}
                className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((element) => (
                  <option key={element._id} value={element._id}>
                    {element.name}
                  </option>
                ))}
              </select>

              <button
                onClick={clearHandleFilter}
                className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 shadow-sm transition"
              >
                Clear filter
              </button>
            </div>

            {/* Add Product */}
            <button
              onClick={addProductModalSetting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-md shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center gap-2"
            >
              <MdAdd className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Product
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Brand Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Code
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Stock
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Description
                </th>
                {myLoginUser?.roleID?.name ===
                  ROLES.HIDE_MASTER_SUPER_ADMIN && (
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Hide
                  </th>
                )}
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  More
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                products.map((element, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">
                      {element?.name || element.productID.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.productID?.BrandID?.name ||
                        element?.BrandID?.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.productCode || element.productID.productCode}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{element.stock}</td>
                    <td className="px-4 py-2 text-gray-700">
                      {element.description}
                    </td>

                    {/* Hide Column */}
                    {myLoginUser?.roleID?.name ===
                      ROLES.HIDE_MASTER_SUPER_ADMIN && (
                      <td className="px-4 py-2 text-center text-gray-700">
                        {element?.isActive ? (
                          <span
                            className="text-green-600 cursor-pointer"
                            onClick={() => {
                              handleClickOpen();
                              setSelectedProduct(element);
                              setDialogData({
                                title: "Are you sure want to hide?",
                                btnSecText: "Hide",
                              });
                            }}
                          >
                            <MdOutlineHideSource />
                          </span>
                        ) : (
                          <span className="text-red-600">Hidden</span>
                        )}
                      </td>
                    )}

                    {/* Action Column */}
                    <td className="px-4 py-2 text-gray-700">
                      <div className="flex gap-2 items-center">
                        <Tooltip title="Edit" arrow>
                          <span
                            className="text-green-600 cursor-pointer"
                            onClick={() => updateProductModalSetting(element)}
                          >
                            <MdEdit />
                          </span>
                        </Tooltip>

                        {[
                          ROLES.HIDE_MASTER_SUPER_ADMIN,
                          ROLES.SUPER_ADMIN,
                        ].includes(myLoginUser?.roleID?.name) && (
                          <Tooltip title="Delete" arrow>
                            <span
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                handleClickOpen();
                                setSelectedProduct(element);
                                setDialogData({
                                  title: "Are you sure want to delete?",
                                  btnSecText: "Delete",
                                });
                              }}
                            >
                              <MdDeleteForever />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={open}
        title={dialogData?.title || ""}
        btnFirstName="Cancel"
        btnSecondName={dialogData?.btnSecText || ""}
        handleClose={handleClose}
        handleDelete={deleteItem}
      />
    </div>
  );
}

export default Inventory;
