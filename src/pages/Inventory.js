import React, { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { toastMessage } from "../utils/handler";
import { MdEdit, MdDeleteForever, MdOutlineHideSource } from "react-icons/md";
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
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>

          <div className=" flex flex-col md:flex-row md:justify-start md:items-center">
            <div className="flex flex-col p-5 w-full md:w-3/12">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {totalCounts?.totalProductCounts}
              </span>
            </div>
            <div className="flex flex-col p-5 w-full md:w-4/12">
              <span className="font-semibold text-blue-600 text-base">
                Total Item In Selected Warehouse
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {totalCounts?.totalItemInWarehouse}
              </span>
            </div>
          </div>
        </div>

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

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
              <div>
                <select
                  id="fromWarehouseID"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  name="fromWarehouseID"
                  value={selectWarehouse}
                  onChange={(e) => handleWarehouse(e.target.value)}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((element, index) => {
                    return (
                      <option key={element._id} value={element._id}>
                        {element.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                  onClick={clearHandleFilter}
                >
                  Clear filter
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addProductModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Product
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Brand Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Code
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Description
                </th>
                {/* <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Availibility
                </th> */}
                {myLoginUser?.roleID?.name ===
                  ROLES.HIDE_MASTER_SUPER_ADMIN && (
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Hide
                  </th>
                )}
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products?.length === 0 && (
                <div className="bg-white w-50 h-fit flex flex-col gap-4 p-4 ">
                  <div className="flex flex-col gap-3 justify-between items-start">
                    <span>No data found</span>
                  </div>
                </div>
              )}
              {products.map((element, index) => {
                return (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.name || element.productID.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element?.productID?.BrandID?.name ||
                        element?.BrandID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.productCode || element.productID.productCode}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.description}
                    </td>
                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock > 0 ? `In Stock (${element.stock})` : "Not in Stock"}
                    </td> */}

                    {/* First column: Hide/Show functionality, conditionally rendered */}
                    {myLoginUser?.roleID?.name ===
                    ROLES.HIDE_MASTER_SUPER_ADMIN ? (
                      <td className="px-4 py-2 text-gray-700 text-center">
                        {element?.isActive ? (
                          <span
                            className="text-green-700 cursor-pointer flex justify-center"
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
                          <span className="text-red-700">Hidden</span>
                        )}
                      </td>
                    ) : (
                      <></> // Placeholder empty cell when the condition doesn't meet
                    )}

                    {/* Second column: Edit/Delete functionality */}
                    <td className="px-4 py-2 text-gray-700">
                      <div className="flex">
                        <Tooltip title="Edit" arrow>
                          <span
                            className="text-green-700 cursor-pointer"
                            onClick={() => updateProductModalSetting(element)}
                          >
                            <MdEdit />
                          </span>
                        </Tooltip>

                        {/* Conditional delete button for roles */}
                        {[
                          ROLES.HIDE_MASTER_SUPER_ADMIN,
                          ROLES.SUPER_ADMIN,
                        ].includes(myLoginUser?.roleID?.name) && (
                          <Tooltip title="Delete" arrow>
                            <span
                              className="text-red-600 px-2 cursor-pointer"
                              onClick={() => {
                                handleClickOpen();
                                setSelectedProduct(element);
                                setDialogData({
                                  title: "Are you sure want to delete?",
                                  btnSecText: "Delete",
                                });
                              }}
                            >
                              <MdDeleteForever width={50} height={50} />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
