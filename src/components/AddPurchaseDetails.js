import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import { Button } from "@mui/material";
import AddBrand from "./AddBrand";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import { FiTrash } from "react-icons/fi";
import PurchaseService from "../services/PurchaseService";
import AuthContext from "../AuthContext";

export default function AddPurchaseDetails({
  addSaleModalSetting,
  products,
  handlePageUpdate,
  brands,
  warehouses,
}) {
  const authContext = useContext(AuthContext);

  const [purchase, setPurchase] = useState([
    {
      userID: authContext.user?._id,
      productID: "",
      quantityPurchased: "",
      purchaseDate: "",
      totalPurchaseAmount: "",
      warehouseID: "",
      supplierName: "",
    },
  ]);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [showBrandModal, setBrandModal] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);

  // Handling Input Change for input fields
  const handleInputChange = (index, key, value) => {
    const updatedProducts = [...purchase];
    if (key === "productID") {
      const brandInfo = products?.find((p) => p._id === value)?.BrandID;
      updatedProducts[index] = {
        ...updatedProducts[index],
        ["brandID"]: brandInfo?._id,
      };
    }
    updatedProducts[index] = { ...updatedProducts[index], [key]: value };
    setPurchase(updatedProducts);
  };

  const formatPurchaseData = () => {
    let purchasePayload = [];
    const purchaseState = purchase.map((item) => ({ ...item }));

    if (purchaseState?.length > 0)
      purchasePayload = purchaseState?.map((item, index) => {
        // Add each item to the submittedItems array
        if (index !== 0) {
          item.purchaseDate = purchase?.[0]?.purchaseDate
            ? moment(new Date(purchase[0].purchaseDate)).format(
                "YYYY-MM-DD HH:mm"
              )
            : moment().format("YYYY-MM-DD HH:mm");
          item.warehouseID = purchase[0].warehouseID;
          item.supplierName = purchase[0].supplierName;
          item.referenceNo = purchase[0].referenceNo;
        } else {
          item.purchaseDate = purchase?.[index].purchaseDate
            ? moment(new Date(purchase[index].purchaseDate)).format(
                "YYYY-MM-DD HH:mm"
              )
            : moment().format("YYYY-MM-DD HH:mm");
        }
        return item;
      });
    return purchasePayload;
  };

  // PDF Download
  const pdfDownload = async () => {
    const purchasePayload = formatPurchaseData();

    // Check if any product field is null or empty
    const hasEmptyField = purchasePayload.some(
      (p) => !p?.productID || !p?.quantityPurchased || !p?.purchaseDate
    );

    const hasFieldLessthanZero = purchasePayload.some(
      (p) => p?.quantityPurchased < 1
    );

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each purchase",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    if (hasFieldLessthanZero) {
      toastMessage(
        "Purchase quantity should be grater than zero",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}purchase/purchase-multipleitems-pdf-download`,
      purchasePayload,
      {
        headers: {
          role: authContext?.user?.roleID?.name,
          requestBy: authContext?.user?._id,
        },
        responseType: "arraybuffer",
        "Content-Type": "application/json",
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
  };

  // POST Data
  const addPurchase = async () => {
    if (purchase?.length === 0) {
      toastMessage("Please add purchase", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    const purchasePayload = formatPurchaseData();

    // Check if any product field is null or empty
    const hasEmptyField = purchasePayload.some(
      (p) => !p?.productID || !p?.quantityPurchased || !p?.purchaseDate
    );

    const hasFieldLessthanZero = purchasePayload.some(
      (p) => p?.quantityPurchased < 1
    );

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each purchase",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    if (hasFieldLessthanZero) {
      toastMessage(
        "Purchase quantity should be grater than zero",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    try {
      await PurchaseService.add(
        purchasePayload,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      toastMessage("Purchase ADDED", TOAST_TYPE.TYPE_SUCCESS);
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
    setPurchase([
      ...purchase,
      {
        userID: authContext.user?._id,
        productID: "",
        quantityPurchased: "",
        purchaseDate: "",
        totalPurchaseAmount: "",
      },
    ]);
  };

  const removeForm = (index) => {
    const updatedProducts = [...purchase];
    updatedProducts.splice(index, 1);
    setPurchase(updatedProducts);
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Format month and day to have leading zeros if necessary
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  }

  return (
    <>
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
                  <div className="mb-6 space-y-1">
                    <div className="flex items-center gap-3">
                      {/* Icon with Tooltip */}
                      <div className="relative group">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 cursor-pointer"
                          aria-label="Create new purchase"
                          onClick={handleAddForm}
                        >
                          <PlusIcon
                            className="h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md z-10">
                          Add new purchase
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-semibold text-gray-900">
                        Add Purchase
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Purchases List */}
                    {purchase.map((p, index) => (
                      <div
                        key={index}
                        className="border-t border-gray-200 pt-6 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-700">
                            Purchase #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeForm(index)}
                            className="text-red-600 hover:text-red-800 text-sm p-1 rounded transition"
                            aria-label="Remove"
                            title="Remove purchase"
                          >
                            <FiTrash className="w-5 h-5" />
                          </button>
                        </div>

                        {index !== 0 && (
                          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm rounded-md p-3 mb-4">
                            <p>
                              Supplier Name, Purchase Date, Reference Number,
                              and Warehouse should be the same as the first
                              purchase.
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`productID-${index}`}
                              className="block text-sm font-medium text-gray-700 text-left"
                            >
                              Product Name
                            </label>
                            <select
                              id={`productID-${index}`}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              name="productID"
                              value={p.productID || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            >
                              <option value="" disabled>
                                Select Products
                              </option>
                              {products.map((element) => (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor={`quantityPurchased-${index}`}
                              className="block text-sm font-medium text-gray-700 text-left"
                            >
                              Quantity Purchased
                            </label>
                            <input
                              type="number"
                              name="quantityPurchased"
                              id={`quantityPurchased-${index}`}
                              value={p.quantityPurchased || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="0 - 999"
                              min={0}
                            />
                          </div>

                          <div
                            className={`grid gap-4 mb-4 ${
                              index !== 0 ? "sm:grid-cols-1" : "sm:grid-cols-2"
                            }`}
                          >
                            <div className="w-full">
                              <label
                                htmlFor={`brandID-${index}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Brand Name
                              </label>
                              <select
                                id={`brandID-${index}`}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="brandID"
                                value={p.brandID || ""}
                                disabled={true}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="" disabled>
                                  Select Brand
                                </option>
                                {brands.map((element) => (
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
                                    htmlFor={`supplierName-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Supplier Name
                                  </label>
                                  <input
                                    type="text"
                                    name="supplierName"
                                    id={`supplierName-${index}`}
                                    value={p.supplierName || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        e.target.name,
                                        e.target.value
                                      )
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Enter Supplier Name"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`warehouseID-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Warehouse Name
                                  </label>
                                  <select
                                    id={`warehouseID-${index}`}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                    name="warehouseID"
                                    value={p.warehouseID || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        e.target.name,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="" disabled>
                                      Select Warehouse
                                    </option>
                                    {warehouses.map((element) => (
                                      <option
                                        key={element._id}
                                        value={element._id}
                                      >
                                        {element.name}
                                      </option>
                                    ))}
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
                                  htmlFor="purchaseDate"
                                >
                                  Purchase Date
                                </label>
                                <DatePicker
                                  dateFormat="dd-MM-yyyy HH:mm"
                                  selected={
                                    purchase[index]?.purchaseDate
                                      ? new Date(purchase[index].purchaseDate)
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
                                    handleInputChange(
                                      index,
                                      "purchaseDate",
                                      date
                                    );
                                  }}
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`referenceNo-${index}`}
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Reference Number
                                </label>
                                <input
                                  type="text"
                                  name="referenceNo"
                                  id={`referenceNo-${index}`}
                                  value={p.referenceNo || ""}
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
                        Download Purchase Invoice
                      </h2>
                      <p className="text-sm text-gray-600 mb-4">
                        Would you like to download the invoice bill for the
                        current purchase?
                      </p>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                          onClick={() => setPdfOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
                          onClick={pdfDownload}
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-xl mt-2">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={addPurchase}
                    >
                      Add Purchase
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
    </>
  );
}
