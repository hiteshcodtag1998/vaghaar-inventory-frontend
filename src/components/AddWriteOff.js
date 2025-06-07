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
import AuthContext from "../AuthContext";
import WriteOffService from "../services/WriteOffService";
import LoaderButton from "./LoaderButton";
import { FiTrash } from "react-icons/fi";

export default function AddWriteOffDetails({
  addWriteOffModalSetting,
  products,
  handlePageUpdate,
  brands,
  warehouses,
}) {
  const authContext = useContext(AuthContext);

  const [writeOff, setPurchase] = useState([
    {
      userID: authContext.user?._id,
      productID: "",
      storeID: "",
      stockSold: "",
      saleDate: "",
      totalSaleAmount: "",
      warehouseID: "",
    },
  ]);
  const [pdfBtnLoader, setPdfBtnLoader] = useState(false);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [showBrandModal, setBrandModal] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);

  // Handling Input Change for input fields
  const handleInputChange = (index, key, value) => {
    try {
      const updatedSales = [...writeOff];
      if (key === "productID") {
        const brandInfo = products?.find((p) => p._id === value)?.BrandID;
        updatedSales[index] = {
          ...updatedSales[index],
          ["brandID"]: brandInfo?._id,
        };
      }
      updatedSales[index] = { ...updatedSales[index], [key]: value };
      setPurchase(updatedSales);
    } catch (error) {
      toastMessage("Somethin went wrong!", TOAST_TYPE.TYPE_ERROR);
    }
  };

  const formatWriteOffData = () => {
    let writeOffPayload = [];
    const writeOffState =
      writeOff?.length > 0 ? writeOff.map((item) => ({ ...item })) : [];

    if (writeOffState?.length > 0) {
      writeOffPayload = writeOffState?.map((item, index) => {
        // Add each item to the submittedItems array
        if (index !== 0) {
          item.saleDate = writeOff?.[0].saleDate
            ? moment(new Date(writeOff[0].saleDate)).format("YYYY-MM-DD HH:mm")
            : moment().format("YYYY-MM-DD HH:mm");
          item.warehouseID = writeOff[0].warehouseID;
          item.supplierName = writeOff[0].supplierName;
          item.referenceNo = writeOff[0].referenceNo;
        } else {
          item.saleDate = writeOff?.[index].saleDate
            ? moment(new Date(writeOff[index].saleDate)).format(
                "YYYY-MM-DD HH:mm"
              )
            : moment().format("YYYY-MM-DD HH:mm");
        }
        return item;
      });
    }
    return writeOffPayload;
  };

  // PDF Download
  const pdfDownload = async () => {
    setPdfBtnLoader(true);

    if (writeOff?.length === 0) {
      toastMessage("Please add writeoff", TOAST_TYPE.TYPE_ERROR);
      setPdfBtnLoader(false);
      return;
    }

    const writeoffPayload = formatWriteOffData();

    const hasEmptyField = writeoffPayload.some(
      (p) => !p?.productID || !p?.stockSold || !p?.saleDate
    );
    const hasFieldLessThanZero = writeoffPayload.some((p) => p?.stockSold < 1);

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each writeoff",
        TOAST_TYPE.TYPE_ERROR
      );
      setPdfBtnLoader(false);
      return;
    }

    if (hasFieldLessThanZero) {
      toastMessage(
        "Writeoff quantity should be greater than zero",
        TOAST_TYPE.TYPE_ERROR
      );
      setPdfBtnLoader(false);
      return;
    }

    try {
      const response = await WriteOffService.downloadMultipleItemsPDF(
        writeoffPayload,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );

      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "writeoff.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.open(url, "_blank");

      toastMessage(
        "WriteOff PDF generated successfully",
        TOAST_TYPE.TYPE_SUCCESS
      );
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
  const addWriteOff = async () => {
    const writeOffPayload = formatWriteOffData();

    if (writeOff?.length === 0) {
      toastMessage("Please add sale", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    const hasEmptyField = writeOffPayload.some(
      (p) => !p?.productID || !p?.stockSold || !p?.saleDate
    );

    const hasFieldLessThanZero = writeOffPayload.some((p) => p?.stockSold < 1);

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each sale",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    if (hasFieldLessThanZero) {
      toastMessage(
        "Writeoff quantity should be greater than zero",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    try {
      await WriteOffService.add(
        writeOffPayload,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      toastMessage("WriteOff ADDED", TOAST_TYPE.TYPE_SUCCESS);
      handlePageUpdate();
      addWriteOffModalSetting(); // close modal
      // setPdfOpen(true); // if you want to show PDF option after add
    } catch (err) {
      toastMessage(
        err?.message || "Something went wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const handleOpenBrand = () => {
    setBrandModal(true);
  };

  const handleAddForm = () => {
    setPurchase([
      ...writeOff,
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
    setPurchase((prevSale) => prevSale.filter((_, i) => i !== index));
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
                        Add new writeoff
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900">
                      Add Writeoff
                    </h2>
                  </div>
                </div>

                {/* Dynamic Product Forms */}
                <div className="space-y-10">
                  {writeOff.map((p, index) => (
                    <div
                      key={index}
                      className="border-t border-gray-200 pt-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">
                          WriteOff #{index + 1}
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
                            {products.map((element, index) => (
                              <option key={element._id} value={element._id}>
                                {element.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="brandID"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Brand Name
                          </label>
                          <select
                            id="brandID"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            name="brandID"
                            disabled={true}
                            value={writeOff[index]?.brandID || ""}
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
                        <div>
                          <label
                            htmlFor="stockSold"
                            className="block text-sm font-medium text-gray-700 text-left"
                          >
                            Stock WriteOff
                          </label>
                          <input
                            type="number"
                            name="stockSold"
                            id="stockSold"
                            value={writeOff[index]?.stockSold || ""}
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

                        <div>
                          <label
                            htmlFor="warehouseID"
                            className="block text-sm font-medium text-gray-700 text-left"
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
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="h-fit w-full">
                          <label
                            className="block text-sm font-medium text-gray-700 text-left"
                            htmlFor="salesDate"
                          >
                            WriteOff Date
                          </label>
                          <DatePicker
                            dateFormat="dd-MM-yyyy HH:mm"
                            selected={
                              writeOff[index]?.saleDate
                                ? new Date(writeOff[index]?.saleDate)
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
                      </div>
                      <div>
                        <label
                          htmlFor="reason"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Reason
                        </label>
                        <input
                          type="text"
                          name="reason"
                          id="reason"
                          value={writeOff[index]?.reason || ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              e.target.name,
                              e.target.value
                            )
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          placeholder="Enter a Reason"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {pdfOpen && (
                  <div className="px-4 py-6 sm:px-8 bg-white shadow rounded-xl border mt-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Download WriteOff Invoice
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Would you like to download the invoice bill for the
                      current writeoff?
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
                    onClick={addWriteOff}
                  >
                    Add WriteOff
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      handlePageUpdate();
                      addWriteOffModalSetting();
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
