import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toastMessage } from "../utils/handler";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { Button } from "@mui/material";
import AddBrand from "./AddBrand";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import SalesService from "../services/SalesService";
import { FiTrash } from "react-icons/fi";
import LoaderButton from "./LoaderButton";
import AuthContext from "../AuthContext";

export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
  brands,
  warehouses,
}) {
  const authContext = useContext(AuthContext);

  const [sale, setSale] = useState([
    {
      userID: authContext.user?._id,
      productID: "",
      // purchaseID: "",
      // purchaseOptions: [], // Holds fetched purchase data for this entry
      stockSold: "",
      saleDate: "",
      totalSaleAmount: "",
      warehouseID: "",
      SupplierName: "",
    },
  ]);

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [showBrandModal, setBrandModal] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [purchaseData, setAllPurchaseData] = useState([]);
  const [pdfBtnLoader, setPdfBtnLoader] = useState(false);

  // Fetching Data of Purchase items
  const fetchPurchaseData = () => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}purchase/get/product/${sale.ro}`,
      {
        headers: {
          role: authContext?.user?.roleID?.name,
          requestBy: authContext?.user?._id,
        },
      }
    )
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

  // Handling Input Change for input fields
  const handleInputChange = (index, key, value) => {
    const updatedSales = [...sale];
    if (key === "productID") {
      const brandInfo = products?.find((p) => p._id === value)?.BrandID;
      updatedSales[index] = {
        ...updatedSales[index],
        ["brandID"]: brandInfo?._id,
      };
    }
    updatedSales[index] = { ...updatedSales[index], [key]: value };
    setSale(updatedSales);
  };

  const formatSaleData = () => {
    let salePayload = [];
    const saleState = sale.map((item) => ({ ...item }));

    if (saleState?.length > 0) {
      salePayload = saleState?.map((item, index) => {
        // Add each item to the submittedItems array
        if (index !== 0) {
          item.saleDate = sale?.[0].saleDate
            ? moment(new Date(sale[0].saleDate)).format("YYYY-MM-DD HH:mm")
            : moment().format("YYYY-MM-DD HH:mm");
          item.warehouseID = sale[0].warehouseID;
          item.SupplierName = sale[0].SupplierName;
          item.referenceNo = sale[0].referenceNo;
        } else {
          item.saleDate = sale?.[index].saleDate
            ? moment(new Date(sale[index].saleDate)).format("YYYY-MM-DD HH:mm")
            : moment().format("YYYY-MM-DD HH:mm");
        }
        return item;
      });
    }
    return salePayload;
  };

  // PDF Download
  const pdfDownload = async () => {
    setPdfBtnLoader(true);

    if (sale?.length === 0) {
      toastMessage("Please add sale", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    const salePayload = formatSaleData();

    const hasEmptyField = salePayload.some(
      (p) => !p?.productID || !p?.stockSold || !p?.saleDate
    );

    const hasFieldLessthanZero = salePayload.some((p) => p?.stockSold < 1);

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each sale",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    if (hasFieldLessthanZero) {
      toastMessage(
        "Sale quantity should be greater than zero",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    try {
      const response = await SalesService.downloadMultipleItemsPDF(
        salePayload,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );

      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.open(url, "_blank");

      toastMessage("Sale PDF generated successfully", TOAST_TYPE.TYPE_SUCCESS);
    } catch (err) {
      toastMessage(
        err?.message || "Something went wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    } finally {
      setPdfBtnLoader(false);
    }
  };

  // POST Data
  const addSale = async () => {
    const salePayload = formatSaleData();

    if (sale?.length === 0) {
      toastMessage("Please add sale", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    const hasEmptyField = salePayload.some(
      (p) => !p?.productID || !p?.stockSold || !p?.saleDate
    );

    const hasFieldLessthanZero = salePayload.some((p) => p?.stockSold < 1);

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each sale",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    if (hasFieldLessthanZero) {
      toastMessage(
        "Sale quantity should be grater than zero",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    try {
      await SalesService.add(
        salePayload,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      toastMessage("Sale ADDED", TOAST_TYPE.TYPE_SUCCESS);
      setPdfOpen(true);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const handleOpenBrand = () => {
    setBrandModal(true);
  };

  const handleAddForm = () => {
    setSale([
      ...sale,
      {
        userID: authContext.user?._id,
        productID: "",
        storeID: "",
        stockSold: "",
        saleDate: "",
        totalSaleAmount: "",
      },
    ]);
  };

  const removeForm = (index) => {
    setSale((prevSale) => prevSale.filter((_, i) => i !== index));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Modal Header */}
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-3">
                    {/* Icon with Tooltip */}
                    <div className="relative group">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 cursor-pointer"
                        aria-label="Create new product"
                        onClick={handleAddForm}
                      >
                        <PlusIcon
                          className="h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md z-10">
                        Add new sale
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900">
                      Add Sale
                    </h2>
                  </div>
                </div>

                {/* Dynamic Product Forms */}
                <div className="space-y-10">
                  {sale.map((p, index) => (
                    <div
                      key={index}
                      className="border-t border-gray-200 pt-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Sale #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeForm(index)}
                          className="text-red-600 hover:text-red-800 text-sm p-1 rounded transition"
                          aria-label="Remove"
                          title="Remove sale"
                        >
                          <FiTrash className="w-5 h-5" />
                        </button>
                      </div>

                      {index !== 0 && (
                        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm rounded-md p-3 mb-4">
                          <p>
                            Customer Name, Sale Date, Reference Number, and
                            Warehouse should be the same as the first sale.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="productID"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Product Name
                          </label>
                          <select
                            id="productID"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            name="productID"
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                          >
                            <option selected="">Select Products</option>
                            {products.map((element, index) => {
                              return (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="stockSold"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Stock Sold
                          </label>
                          <input
                            type="number"
                            name="stockSold"
                            id="stockSold"
                            value={sale.stockSold}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="0 - 999"
                          />
                        </div>

                        <div
                          className={`grid gap-4 mb-4 ${
                            index !== 0 ? "sm:grid-cols-1" : "sm:grid-cols-2"
                          }`}
                        >
                          <div>
                            <label
                              htmlFor="brandID"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Brand Name
                            </label>
                            <select
                              id="brandID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              name="brandID"
                              value={sale[index]?.brandID || ""}
                              disabled={true}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            >
                              <option selected="">Select Brand</option>
                              {brands.map((element, index) => (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {index === 0 && (
                            <>
                              <div>
                                <label
                                  htmlFor="SupplierName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Customer Name
                                </label>
                                <input
                                  type="text"
                                  name="SupplierName"
                                  id="SupplierName"
                                  value={sale.SupplierName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      e.target.name,
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                  placeholder="Enter Customer Name"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="warehouseID"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Warehouse Name
                                </label>
                                <select
                                  id="warehouseID"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                  name="warehouseID"
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      e.target.name,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option selected="">Select Warehouse</option>
                                  {warehouses.map((element, index) => {
                                    return (
                                      <option
                                        key={element._id}
                                        value={element._id}
                                      >
                                        {element.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </>
                          )}
                        </div>

                        {index === 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="h-fit w-full">
                              <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="salesDate"
                              >
                                Sales Date
                              </label>
                              <DatePicker
                                dateFormat="dd-MM-yyyy HH:mm"
                                selected={
                                  sale[index]?.saleDate
                                    ? new Date(sale[index].saleDate)
                                    : new Date()
                                }
                                placeholderText="dd-mm-yyyy"
                                maxDate={new Date()}
                                showTimeSelect
                                timeIntervals={1}
                                disabled={
                                  ![
                                    ROLES.HIDE_MASTER_SUPER_ADMIN,
                                    ROLES.SUPER_ADMIN,
                                  ].includes(authContext?.user?.roleID?.name)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                onChange={(date) => {
                                  handleInputChange(index, "saleDate", date);
                                }}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="referenceNo"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Reference Number
                              </label>
                              <input
                                type="text"
                                name="referenceNo"
                                id="referenceNo"
                                value={sale.referenceNo}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter Reference Number"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {pdfOpen && (
                  <div className="px-4 py-6 sm:px-8 bg-white shadow rounded-xl border mt-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Download Sale Invoice
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Would you like to download the invoice bill for the
                      current sale?
                    </p>

                    <div className="flex justify-start gap-2">
                      <LoaderButton
                        loading={pdfBtnLoader}
                        onClick={pdfDownload}
                      >
                        Download PDF
                      </LoaderButton>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse rounded-xl sm:px-6 mt-2">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addSale}
                  >
                    Add Sale
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      handlePageUpdate();
                      addSaleModalSetting();
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>

                {showBrandModal && (
                  <AddBrand
                    addBrandModalSetting={() => {
                      setBrandModal(false);
                    }}
                    handlePageUpdate={handlePageUpdate}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
