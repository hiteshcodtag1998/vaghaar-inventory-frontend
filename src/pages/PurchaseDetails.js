import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AuthContext from "../AuthContext";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import { FaDownload } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import UpdatePurchaseDetails from "../components/UpdatePurchaseDetails";
import { MdAdd, MdDeleteForever, MdEdit } from "react-icons/md";
import moment from "moment-timezone";
import ConfirmationDialog from "../components/ConfirmationDialog";
import BrandService from "../services/BrandService";
import WarehouseService from "../services/WarehouseService";
import ProductService from "../services/ProductService";
import PurchaseService from "../services/PurchaseService";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [showUpdatePurchaseModal, setUpdatePurchaseModal] = useState(false);
  const [updatePurchase, setUpdatePurchase] = useState([]);
  const [purchase, setAllPurchaseData] = useState([]);
  const [brands, setAllBrands] = useState([]);
  const [warehouses, setAllWarehouses] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [pdfBtnLoaderIndexes, setPdfBtnLoaderIndexes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState();
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchPurchaseData(),
          fetchProductsData(),
          fetchBrandData(),
          fetchWarehouseData(),
        ]);
      } catch (err) {
        toastMessage(
          err?.message || "Something goes wrong",
          TOAST_TYPE.TYPE_ERROR
        );
      }
    };

    fetchAllData();
  }, [updatePage]);

  const fetchPurchaseData = async () => {
    try {
      const data = await PurchaseService.getAll(
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

  // Modal for Purchase Add
  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };

  // Modal for Sale Add
  const updatePurchaseModalSetting = (selectedPurchaseData) => {
    setUpdatePurchase(selectedPurchaseData);
    setUpdatePurchaseModal(!showUpdatePurchaseModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const handleDownload = async (data, index) => {
    try {
      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = true;
        return newIndexes;
      });

      const response = await PurchaseService.downloadPDF(data);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Delete item
  const deleteItem = () => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}purchase/delete/${selectedProduct?._id}`,
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

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showPurchaseModal && (
          <AddPurchaseDetails
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            brands={brands}
            handlePageUpdate={handlePageUpdate}
            warehouses={warehouses}
          />
        )}
        {showUpdatePurchaseModal && (
          <UpdatePurchaseDetails
            brands={brands}
            products={products}
            authContext={authContext}
            updatePurchaseData={updatePurchase}
            updateModalSetting={updatePurchaseModalSetting}
            fetchPurchaseData={fetchPurchaseData}
            warehouses={warehouses}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex items-center justify-between px-4 py-4 border-b bg-white rounded-t-md">
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Purchase
            </h2>
            <button
              onClick={addSaleModalSetting}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            >
              <MdAdd className="w-5 h-5" />
              Add Purchase
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
                  Quantity Purchased
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Supplier Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Warehouse Name
                </th>
                {myLoginUser?.roleID?.name ===
                  ROLES.HIDE_MASTER_SUPER_ADMIN && (
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Status
                  </th>
                )}
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Purchase Date
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
                    colSpan={8}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                purchase.map((element, index) => (
                  <tr key={element._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">
                      {element?.ProductID?.name || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.BrandID?.name || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.QuantityPurchased}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.SupplierName || ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {element?.warehouseID?.name || ""}
                    </td>
                    {myLoginUser?.roleID?.name ===
                      ROLES.HIDE_MASTER_SUPER_ADMIN && (
                      <td className="px-4 py-2 text-gray-700">
                        {element?.isActive ? "Available" : "Deleted"}
                      </td>
                    )}
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(element?.PurchaseDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : element?.PurchaseDate
                        ? moment
                            .tz(element.PurchaseDate, moment.tz.guess())
                            .format("DD-MM-YYYY HH:mm")
                        : ""}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      <div className="flex gap-2 items-center">
                        <Tooltip title="Edit" arrow>
                          <span
                            className="text-green-600 cursor-pointer"
                            onClick={() => updatePurchaseModalSetting(element)}
                          >
                            <MdEdit />
                          </span>
                        </Tooltip>

                        <Tooltip title="Download Purchase Note" arrow>
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

export default PurchaseDetails;
