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
import TransferStockService from "../services/TransferStockService";
import AuthContext from "../AuthContext";

export default function AddTransferStockDetails({
  addTransferStockModalSetting,
  products,
  handlePageUpdate,
  brands,
  warehouses,
}) {
  const authContext = useContext(AuthContext);

  const [purchase, setPurchase] = useState({
    userID: authContext.user?._id,
    productID: "",
    quantityPurchased: "",
    purchaseDate: new Date(),
    totalPurchaseAmount: "",
    fromWarehouseID: "",
    toWarehouseID: "",
    brandID: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [showBrandModal, setBrandModal] = useState(false);

  // Handling Input Change for input fields
  const handleInputChange = (key, value) => {
    let updatedTransferData = { ...purchase };
    if (key === "productID") {
      const brandInfo = products?.find((p) => p._id === value)?.BrandID;
      updatedTransferData = { ...updatedTransferData, brandID: brandInfo?._id };
    }

    updatedTransferData = { ...updatedTransferData, [key]: value };

    setPurchase(updatedTransferData);
  };

  // POST Data
  const addTransferStock = async () => {
    const hasEmptyField =
      !purchase ||
      !purchase.productID ||
      !purchase.quantityPurchased ||
      !purchase.purchaseDate;

    const hasFieldLessThanZero = Object.values(purchase).some((p) => {
      return p.quantityPurchased < 1;
    });

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each purchase",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    if (hasFieldLessThanZero) {
      toastMessage(
        "Transfer quantity should be grater than zero",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    const payload = {
      ...purchase,
      purchaseDate: moment(new Date(purchase.purchaseDate)).format(
        "YYYY-MM-DD HH:mm"
      ),
    };

    try {
      await TransferStockService.add(
        payload,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );

      toastMessage("TransferStock ADDED", TOAST_TYPE.TYPE_SUCCESS);
      handlePageUpdate();
      addTransferStockModalSetting();
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
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900">
                      TransferStock Details
                    </h2>
                  </div>
                </div>

                <div className="space-y-10">
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
                          handleInputChange(e.target.name, e.target.value)
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
                        value={purchase?.brandID || ""}
                        disabled={true}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
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
                        htmlFor="quantityPurchased"
                        className="block text-sm font-medium text-gray-700 text-left"
                      >
                        Quantity Purchased
                      </label>
                      <input
                        type="number"
                        name="quantityPurchased"
                        id="quantityPurchased"
                        value={purchase.quantityPurchased}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="0 - 999"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="fromWarehouseID"
                        className="block text-sm font-medium text-gray-700 text-left"
                      >
                        From Warehouse
                      </label>
                      <select
                        id="fromWarehouseID"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        name="fromWarehouseID"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
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

                    <div>
                      <label
                        htmlFor="toWarehouseID"
                        className="block text-sm font-medium text-gray-700 text-left"
                      >
                        To Warehouse
                      </label>
                      <select
                        id="toWarehouseID"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        name="toWarehouseID"
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                      >
                        <option selected="">Select Warehouse</option>
                        {warehouses?.length > 0 &&
                          warehouses
                            .filter((w) => w._id !== purchase.fromWarehouseID)
                            ?.map((element, index) => {
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
                        className="block text-sm font-medium text-gray-700 text-left"
                        htmlFor="purchaseDate"
                      >
                        Transfer Date
                      </label>
                      <DatePicker
                        dateFormat="dd-MM-yyyy HH:mm"
                        selected={
                          purchase?.purchaseDate
                            ? new Date(purchase.purchaseDate)
                            : new Date()
                        }
                        placeholderText="dd-mm-yyyy HH:mm"
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
                          handleInputChange("purchaseDate", date);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse rounded-xl sm:px-6 mt-2">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addTransferStock}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addTransferStockModalSetting()}
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
