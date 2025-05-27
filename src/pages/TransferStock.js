import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import AddTransferStockDetails from "../components/AddTransferStock";
import { FaDownload } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import moment from "moment";

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
    fetchPurchaseData();
    fetchProductsData();
    fetchBrandData();
    fetchWarehouseData();
  }, [updatePage]);

  // Fetching Data of All Purchase items
  const fetchPurchaseData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}transferstock/get`, {
      headers: { role: myLoginUser?.roleID?.name, requestBy: myLoginUser?._id },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllPurchaseData(data);
      })
      .catch((err) =>
        toastMessage(
          err?.message || "Something goes wrong",
          TOAST_TYPE.TYPE_ERROR
        )
      );
  };

  // Fetching Data of All Warehouse items
  const fetchWarehouseData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}warehouse/get`, {
      headers: { role: myLoginUser?.roleID?.name },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllWarehouses(data);
      })
      .catch((err) =>
        toastMessage(
          err?.message || "Something goes wrong",
          TOAST_TYPE.TYPE_ERROR
        )
      );
  };

  // Fetching Data of All Brrand items
  const fetchBrandData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}brand/get`, {
      headers: { role: myLoginUser?.roleID?.name },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllBrands(data);
      })
      .catch((err) =>
        toastMessage(
          err?.message || "Something goes wrong",
          TOAST_TYPE.TYPE_ERROR
        )
      );
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}product/get`, {
      headers: { role: myLoginUser?.roleID?.name },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) =>
        toastMessage(
          err?.message || "Something goes wrong",
          TOAST_TYPE.TYPE_ERROR
        )
      );
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
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
        `${process.env.REACT_APP_API_BASE_URL}transferstock/transfterstock-pdf-download`,
        data,
        {
          responseType: "arraybuffer",
        }
      );
      console.log("response", response);
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
      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = false;
        return newIndexes;
      });
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      setPdfBtnLoaderIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = false;
        return newIndexes;
      });
      console.log("Error", error);
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showPurchaseModal && (
          <AddTransferStockDetails
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            brands={brands}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
            warehouses={warehouses}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">TransferStock Details</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add TransferStock
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
                  Quantity Transfer
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sending Location
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Receiving Location
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Transfer Date
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
                      {element.productID?.name || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.brandID?.name || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.fromWarehouseID?.name || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.toWarehouseID?.name || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.transferDate).toLocaleDateString() ==
                      new Date().toLocaleDateString()
                        ? "Today"
                        : moment(element.transferDate, "YYYY-MM-DD").format(
                            "DD-MM-YYYY"
                          )}
                    </td>
                    <td>
                      <div className="flex">
                        <Tooltip title="Download Sale Note" arrow>
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
    </div>
  );
}

export default TransferStockDetails;
