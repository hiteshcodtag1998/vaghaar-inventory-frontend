import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import AddTransferStockDetails from "../components/AddTransferStock";
import { FaDownload } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import moment from "moment";
import TransferStockService from "../services/TransferStockService";
import ProductService from "../services/ProductService";
import BrandService from "../services/BrandService";
import WarehouseService from "../services/WarehouseService";
import { MdAdd } from "react-icons/md";

function TransferStockDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [brands, setAllBrands] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [warehouses, setAllWarehouses] = useState([]);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));
  const [pdfBtnLoaderIndexes, setPdfBtnLoaderIndexes] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchTransferStockData();
    fetchProductsData();
    fetchBrandData();
    fetchWarehouseData();
  }, [updatePage]);

  // Fetching Data of All Transfer items
  const fetchTransferStockData = async () => {
    try {
      const data = await TransferStockService.getAll(
        myLoginUser?.roleID?.name,
        myLoginUser?._id
      );
      setAllPurchaseData(data);
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

  // Fetching Data of All Brand items
  const fetchBrandData = async () => {
    try {
      const data = await BrandService.getAll(
        myLoginUser?.roleID?.name,
        myLoginUser?._id
      );
      setAllBrands(data);
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
      const data = await ProductService.getAll(
        myLoginUser?.roleID?.name,
        myLoginUser?._id
      );
      setAllProducts(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  // Modal for Sale Add
  const addTransferStockModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const handleDownload = async (data, index) => {
    try {
      // Enable loader
      setPdfBtnLoaderIndexes((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      // Call download API
      const response = await TransferStockService.downloadPDF(data);

      // Convert to blob and trigger download
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "transfer-invoice.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.open(url, "_blank");

      // Disable loader
      setPdfBtnLoaderIndexes((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    } catch (error) {
      setPdfBtnLoaderIndexes((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
      console.error("Transfer download error:", error);
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showPurchaseModal && (
          <AddTransferStockDetails
            addTransferStockModalSetting={addTransferStockModalSetting}
            products={products}
            brands={brands}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
            warehouses={warehouses}
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex items-center justify-between px-4 py-4 border-b bg-white rounded-t-md">
            <h2 className="text-lg font-semibold text-gray-800">
              TransferStock Details
            </h2>
            <button
              onClick={addTransferStockModalSetting}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            >
              <MdAdd className="w-5 h-5" />
              Add TransferStock
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
                  Quantity Transfer
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Sending Location
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Receiving Location
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Transfer Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {purchase?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                purchase.map((element, index) => (
                  <tr key={element._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">
                      {element.productID?.name || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.brandID?.name || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element.quantity}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.fromWarehouseID?.name || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.toWarehouseID?.name || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(element.transferDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : moment(element.transferDate).format("DD-MM-YYYY")}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      <div className="flex gap-2 items-center">
                        <Tooltip title="Download Transfer Note" arrow>
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

                        {/* Optional: Add Edit or Delete icons like in Sales if needed */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransferStockDetails;
