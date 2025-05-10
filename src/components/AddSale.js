import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toastMessage } from "../utils/handler";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { Button } from "@mui/material";
import AddBrand from "./AddBrand";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import axios from 'axios'

export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
  authContext,
  brands,
  warehouses
}) {
  const [sale, setSale] = useState([
    {
      userID: authContext.user,
      productID: "",
      // purchaseID: "",
      // purchaseOptions: [], // Holds fetched purchase data for this entry
      stockSold: "",
      saleDate: "",
      totalSaleAmount: "",
      warehouseID: "",
      supplierName: "",
    },
  ]);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [showBrandModal, setBrandModal] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [purchaseData, setAllPurchaseData] = useState([]);



  // Fetching Data of Purchase items
  const fetchPurchaseData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}purchase/get/product/${sale.ro}`, {
      headers: { role: myLoginUser?.roleID?.name, requestBy: myLoginUser?._id, }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllPurchaseData(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };


  // Handling Input Change for input fields
  const handleInputChange = (index, key, value) => {
    const updatedSales = [...sale];
    if (key === 'productID') {
      const brandInfo = products?.find(p => p._id === value)?.BrandID;
      updatedSales[index] = { ...updatedSales[index], ['brandID']: brandInfo?._id };
    }
    updatedSales[index] = { ...updatedSales[index], [key]: value };
    setSale(updatedSales);
  };




  const formatSaleData = () => {
    let salePayload = []
    const saleState = sale.map(item => ({ ...item }));

    if (saleState?.length > 0) {
      salePayload = saleState?.map((item, index) => {
        // Add each item to the submittedItems array
        if (index !== 0) {
          item.saleDate = sale?.[0].saleDate ? moment(new Date(sale[0].saleDate)).format('YYYY-MM-DD HH:mm') : moment().format('YYYY-MM-DD HH:mm')
          item.warehouseID = sale[0].warehouseID
          item.supplierName = sale[0].supplierName
          item.referenceNo = sale[0].referenceNo
        } else {
          item.saleDate = sale?.[index].saleDate ? moment(new Date(sale[index].saleDate)).format('YYYY-MM-DD HH:mm') : moment().format('YYYY-MM-DD HH:mm')
        }
        return item
      });
    }
    return salePayload
  }

  // PDF Download
  const pdfDownload = async () => {

    const salePayload = formatSaleData();

    if (sale?.length === 0) {
      toastMessage("Please add sale", TOAST_TYPE.TYPE_ERROR)
      return;
    }

    // Check if any product field is null or empty
    const hasEmptyField = salePayload.some(
      (p) =>
        !p?.productID ||
        !p?.stockSold ||
        !p?.saleDate
    )

    const hasFieldLessthanZero = salePayload.some(
      (p) =>
        p?.stockSold < 1
    )

    if (hasEmptyField) {
      toastMessage("Please fill in all fields for each sale", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    if (hasFieldLessthanZero) {
      toastMessage("Sale quantity should be grater than zero", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}sales/sale-multipleitems-pdf-download`,
      salePayload,
      {
        headers: {
          'role': myLoginUser?.roleID?.name,
          'requestBy': myLoginUser?._id,
        },
        responseType: 'arraybuffer',
        'Content-Type': 'application/json',
      }
    );
    // Assuming the server returns the PDF content as a blob
    // setPdfData(new Blob([response.data], { type: 'application/pdf' }));

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.open(url, '_blank');
  };

  // POST Data
  const addSale = () => {

    const salePayload = formatSaleData();

    if (sale?.length === 0) {
      toastMessage("Please add sale", TOAST_TYPE.TYPE_ERROR)
      return;
    }

    // Check if any product field is null or empty
    const hasEmptyField = salePayload.some(
      (p) =>
        !p?.productID ||
        !p?.stockSold ||
        !p?.saleDate
    )

    const hasFieldLessthanZero = salePayload.some(
      (p) =>
        p?.stockSold < 1
    )

    if (hasEmptyField) {
      toastMessage("Please fill in all fields for each sale", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    if (hasFieldLessthanZero) {
      toastMessage("Sale quantity should be grater than zero", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}sales/add`, {
      method: "POST",
      headers: {
        role: myLoginUser?.roleID?.name,
        requestBy: myLoginUser?._id,
        "Content-type": "application/json",
      },
      body: JSON.stringify(salePayload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json(); // Assuming the error response is in JSON format
          throw new Error(errorData.message || errorData.error || "Something went wrong on the server");
        }

        toastMessage("Sale ADDED", TOAST_TYPE.TYPE_SUCCESS)
        // handlePageUpdate();
        // addSaleModalSetting();
        setPdfOpen(true)
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  const handleOpenBrand = () => {
    setBrandModal(true)
  };

  const handleAddForm = () => {
    setSale([...sale, {
      userID: authContext.user,
      productID: "",
      storeID: "",
      stockSold: "",
      saleDate: "",
      totalSaleAmount: "",
    }]);
  };

  const removeForm = (index) => {
    setSale(prevSale => prevSale.filter((_, i) => i !== index));
  };

  return (
    // Modal
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 mt-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                        onClick={handleAddForm}
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-2 sm:ml-4 sm:text-left ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg  py-4 font-semibold leading-6 text-gray-900 "
                      >
                        Add Sale
                      </Dialog.Title>
                      {sale.map((p, index) => (
                        <form key={index} action="#">
                          <div className="flex justify-between items-center mt-5">
                            <span>Sale: {index + 1}</span>
                            <div className="flex-1 border-t border-gray-300 mx-2"></div>
                            <button
                              type="button"
                              className="flex justify-center items-center px-2 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white rounded-lg py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                              onClick={() => removeForm(index)}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                          </div>
                          <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="productID"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Product Name
                              </label>
                              <select
                                id="productID"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                name="productID"
                                onChange={(e) =>
                                  handleInputChange(index, e.target.name, e.target.value)
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
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Stock Sold
                              </label>
                              <input
                                type="number"
                                name="stockSold"
                                id="stockSold"
                                value={sale.stockSold}
                                onChange={(e) =>
                                  handleInputChange(index, e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="0 - 999"
                              />
                            </div>
                          </div>


                          <div className={`grid gap-4 mb-4 ${index !== 0 ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
                            <div>
                              <label
                                htmlFor="brandID"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Brand Name
                              </label>
                              <select
                                id="brandID"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                name="brandID"
                                value={sale[index]?.brandID || ''}
                                disabled={true}
                                onChange={(e) => handleInputChange(index, e.target.name, e.target.value)}
                              >
                                <option selected="">Select Brand</option>
                                {brands.map((element, index) => (
                                  <option key={element._id} value={element._id}>
                                    {element.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {index === 0 &&
                              <>
                                <div>
                                  <label
                                    htmlFor="supplierName"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Customer Name
                                  </label>
                                  <input
                                    type="text"
                                    name="supplierName"
                                    id="supplierName"
                                    value={sale.supplierName}
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.name, e.target.value)
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Customer Name"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="warehouseID"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Warehouse Name
                                  </label>
                                  <select
                                    id="warehouseID"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    name="warehouseID"
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.name, e.target.value)
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
                              </>}
                          </div>
                          <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            {/*Code for future ref
                          <div>
                            <label
                              htmlFor="storeID"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Store Name
                            </label>
                            <select
                              id="storeID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="storeID"
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option selected="">Select Store</option>
                              {stores.map((element, index) => {
                                return (
                                  <option key={element._id} value={element._id}>
                                    {element.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div> */}
                            {/* <div>
                            <label
                              htmlFor="totalSaleAmount"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Total Sale Amount
                            </label>
                            <input
                              type="number"
                              name="totalSaleAmount"
                              id="price"
                              value={sale.totalSaleAmount}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="$299"
                            />
                          </div> */}

                            {/* <div className="mt-7">
                              <Button className="pt-10" onClick={handleOpenBrand} variant="contained" color="secondary">
                                Add Brand
                              </Button>
                            </div> */}
                            {index === 0 &&
                              <>
                                <div className="h-fit w-full">
                                  {/* <Datepicker
                              onChange={handleChange}
                              show={show}
                              setShow={handleClose}
                            /> */}
                                  <label
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    htmlFor="salesDate"
                                  >
                                    Sales Date
                                  </label>
                                  <DatePicker
                                    dateFormat="dd-MM-yyyy HH:mm"
                                    selected={sale[index]?.saleDate ? new Date(sale[index].saleDate) : new Date()}
                                    placeholderText="dd-mm-yyyy"
                                    maxDate={new Date()}
                                    showTimeSelect
                                    timeIntervals={1}
                                    disabled={![ROLES.HIDE_MASTER_SUPER_ADMIN, ROLES.SUPER_ADMIN].includes(myLoginUser?.roleID?.name)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    onChange={(date) => {
                                      handleInputChange(index, 'saleDate', date)
                                    }}
                                  />
                                  {/* <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    type="date"
                                    id="saleDate"
                                    name="saleDate"
                                    value={sale.saleDate}
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.name, e.target.value)
                                    }
                                  /> */}
                                </div>
                                <div>
                                  <label
                                    htmlFor="referenceNo"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Reference Number
                                  </label>
                                  <input
                                    type="text"
                                    name="referenceNo"
                                    id="referenceNo"
                                    value={sale.referenceNo}
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.name, e.target.value)
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Reference Number"
                                  />
                                </div>
                              </>
                            }
                          </div>
                          <div className="flex items-center space-x-4">
                            {/* <button
                            type="submit"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            Update product
                          </button> */}
                            {/* <button
                            type="button"
                            className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          >
                            <svg
                              className="mr-1 -ml-1 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            Delete
                          </button> */}

                          </div>

                        </form>
                      ))}
                    </div>
                  </div>
                </div>
                {pdfOpen && <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <h2 className="text-lg font-semibold">Are you want to download invoice bill?</h2>
                  <p>This is the existing dialog sale items.</p>

                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                    onClick={pdfDownload}
                  >
                    Pdf Download
                  </button>
                </div>}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
                    addBrandModalSetting={() => { setBrandModal(false) }}
                    handlePageUpdate={handlePageUpdate}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root >
  );
}
