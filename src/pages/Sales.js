import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";
import { toastMessage } from "../utils/handler";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { FaDownload } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import UpdateSale from "../components/UpdateSale";
import { MdAdd, MdDeleteForever, MdEdit } from "react-icons/md";
// import moment from "moment";
import moment from "moment-timezone";
import ConfirmationDialog from "../components/ConfirmationDialog";
import WarehouseService from "../services/WarehouseService";
import StoreService from "../services/StoreService";
import BrandService from "../services/BrandService";
import ProductService from "../services/ProductService";
import SalesService from "../services/SalesService";

function Sales() {
  const authContext = useContext(AuthContext);

  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [brands, setAllBrands] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [warehouses, setAllWarehouses] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [pdfBtnLoaderIndexes, setPdfBtnLoaderIndexes] = useState([]);
  const [showUpdateSaleModal, setUpdateSaleModal] = useState(false);
  const [updateSale, setUpdateSale] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState();

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
    fetchBrandData();
    fetchWarehouseData();
  }, [updatePage]);

  // Fetching Data of All Sales
  const fetchSalesData = async () => {
    try {
      const data = await SalesService.getAll(
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      setAllSalesData(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  // Fetching Data of All Products
  const fetchProductsData = async () => {
    try {
      const data = await ProductService.getAll(authContext?.user?.roleID?.name);
      setAllProducts(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  // Fetching Data of All Brrand items
  const fetchBrandData = async () => {
    try {
      const data = await BrandService.getAll(authContext?.user?.roleID?.name);
      setAllBrands(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  // Fetching Data of All Stores
  const fetchStoresData = async () => {
    try {
      const data = await StoreService.getAll(authContext?.user?.roleID?.name);
      setAllStores(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  // Fetching Data of All Warehouse items
  const fetchWarehouseData = async () => {
    try {
      const data = await WarehouseService.getAll(
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      setAllWarehouses(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const handleDownload = async (data, index) => {
    try {
      // Set the loader to true for the specific index
      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = true;
        return newIndexes;
      });

      const response = await SalesService.downloadPDF(data);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.open(url, "_blank");

      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = false;
        return newIndexes;
      });
    } catch (error) {
      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = false;
        return newIndexes;
      });
      console.log("Error", error);
    }
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Modal for Sale Update
  const updateSaleModalSetting = (selectedSaleData) => {
    setUpdateSale(selectedSaleData);
    setUpdateSaleModal(!showUpdateSaleModal);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Delete item
  const deleteItem = () => {
    SalesService.deleteById(updateSale?._id, authContext?.user?.roleID?.name)
      .then(() => {
        setUpdateSale();
        setUpdatePage(!updatePage);
        handleClose();
      })
      .catch(() => {
        setUpdateSale();
        handleClose();
      });
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            brands={brands}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
            warehouses={warehouses}
          />
        )}
        {showUpdateSaleModal && (
          <UpdateSale
            brands={brands}
            products={products}
            authContext={authContext}
            updateSaleData={updateSale}
            updateModalSetting={updateSaleModalSetting}
            fetchSalesData={fetchSalesData}
            warehouses={warehouses}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex items-center justify-between px-4 py-4 border-b bg-white rounded-t-md">
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Sales
            </h2>
            <button
              onClick={addSaleModalSetting}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            >
              <MdAdd className="w-5 h-5" />
              Add Sales
            </button>
          </div>

          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Brand Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Stock Sold
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Warehouse Name
                </th>
                {authContext?.user?.roleID?.name ===
                  ROLES.HIDE_MASTER_SUPER_ADMIN && (
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Status
                  </th>
                )}
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Sales Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sales?.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                sales.map((element, index) => (
                  <tr key={element._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">
                      {element.ProductID?.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.BrandID?.name || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element.StockSold}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.SupplierName || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.warehouseID?.name || ""}
                    </td>
                    {authContext?.user?.roleID?.name ===
                      ROLES.HIDE_MASTER_SUPER_ADMIN && (
                      <td className="px-4 py-2 text-gray-700">
                        {element?.isActive ? "Available" : "Deleted"}
                      </td>
                    )}
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(element.SaleDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : element?.SaleDate
                        ? moment
                            .tz(element.SaleDate, moment.tz.guess())
                            .format("DD-MM-YYYY HH:mm")
                        : null}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      <div className="flex gap-2 items-center">
                        <Tooltip title="Edit" arrow>
                          <span
                            className="text-green-600 cursor-pointer"
                            onClick={() => updateSaleModalSetting(element)}
                          >
                            <MdEdit />
                          </span>
                        </Tooltip>

                        <Tooltip title="Download Sale Note" arrow>
                          <span className="text-green-600 cursor-pointer">
                            {pdfBtnLoaderIndexes[index] ? (
                              <CircularProgress size={20} />
                            ) : (
                              <FaDownload
                                onClick={() => handleDownload(element, index)}
                              />
                            )}
                          </span>
                        </Tooltip>

                        {[
                          ROLES.HIDE_MASTER_SUPER_ADMIN,
                          ROLES.SUPER_ADMIN,
                        ].includes(authContext?.user?.roleID?.name) && (
                          <Tooltip title="Delete" arrow>
                            <span
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                handleClickOpen();
                                setUpdateSale(element);
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

export default Sales;
