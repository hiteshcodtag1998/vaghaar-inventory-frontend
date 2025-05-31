import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AuthContext from "../AuthContext";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import { FaDownload } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import UpdatePurchaseDetails from "../components/UpdatePurchaseDetails";
import { MdDeleteForever, MdEdit } from "react-icons/md";
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
      // Set the loader to true for the specific index
      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = true;
        return newIndexes;
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}purchase/purchase-pdf-download`,
        data,
        {
          responseType: "arraybuffer",
        }
      );
      // Assuming the server returns the PDF content as a blob
      // setPdfData(new Blob([response.data], { type: 'application/pdf' }));

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
      // After download is complete, set the loader back to false for the specific index
      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = false;
        return newIndexes;
      });
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      // After download is complete, set the loader back to false for the specific index
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
            authContext={authContext}
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
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Purchase</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Purchase
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Brand Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Quantity Purchased
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Supplier Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Warehouse Name
                </th>
                {myLoginUser?.roleID?.name ===
                  ROLES.HIDE_MASTER_SUPER_ADMIN && (
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Status
                  </th>
                )}
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Purchase Date
                </th>
                <th className="whitespace-nowrap text-left font-medium text-gray-900">
                  Action
                </th>
                {/* <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Purchase Amount
                </th> */}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {purchase?.length === 0 && (
                <div className="bg-white w-50 h-fit flex flex-col gap-4 p-4 ">
                  <div className="flex flex-col gap-3 justify-between items-start">
                    <span>No data found</span>
                  </div>
                </div>
              )}
              {purchase.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.ProductID?.name || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.BrandID?.name || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.QuantityPurchased}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.SupplierName || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.warehouseID?.name || ""}
                    </td>
                    {myLoginUser?.roleID?.name ===
                      ROLES.HIDE_MASTER_SUPER_ADMIN && (
                      <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                        {element?.isActive ? "Availble" : "Deleted"}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {
                        new Date(element.PurchaseDate).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? "Today"
                          : element?.PurchaseDate
                          ? moment
                              .tz(element.PurchaseDate, moment.tz.guess())
                              .format("DD-MM-YYYY HH:mm")
                          : null
                        // moment(element.PurchaseDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                      }
                    </td>
                    <td>
                      <div className="flex">
                        <Tooltip title="Edit" arrow>
                          <span
                            className="text-green-700 cursor-pointer"
                            onClick={() => updatePurchaseModalSetting(element)}
                          >
                            <MdEdit />
                          </span>
                        </Tooltip>
                        <Tooltip title="Download Purchase Note" arrow>
                          <span className="text-green-700 px-2 flex">
                            {pdfBtnLoaderIndexes[index] ? (
                              <CircularProgress size={20} />
                            ) : (
                              <FaDownload
                                className={`cursor-pointer ${
                                  pdfBtnLoaderIndexes[index] && "block"
                                }`}
                                onClick={() => handleDownload(element, index)}
                              />
                            )}
                          </span>
                        </Tooltip>
                        {/* Conditional delete button for roles */}
                        {[
                          ROLES.HIDE_MASTER_SUPER_ADMIN,
                          ROLES.SUPER_ADMIN,
                        ].includes(myLoginUser?.roleID?.name) && (
                          <Tooltip title="Delete" arrow>
                            <span
                              className="text-red-600 pr-2 cursor-pointer"
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
                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ${element.TotalPurchaseAmount}
                    </td> */}
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

export default PurchaseDetails;
