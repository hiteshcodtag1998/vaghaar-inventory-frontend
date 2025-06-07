import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import DatePicker from "react-datepicker";
import moment from "moment";
import AuthContext from "../AuthContext";
import WriteOffService from "../services/WriteOffService";

export default function UpdateWriteOff({
  brands,
  products,
  updateWriteOffData,
  updateModalSetting,
  fetchWriteOffData,
  warehouses,
}) {
  const {
    _id,
    SaleDate,
    ProductID,
    BrandID,
    totalPurchaseAmount,
    SupplierName,
    reason,
    StockSold,
    warehouseID,
  } = updateWriteOffData;
  const authContext = useContext(AuthContext);

  const [writeOff, setWriteOff] = useState({
    writeOffID: _id,
    userID: authContext.user?._id,
    productID: ProductID?._id,
    stockSold: StockSold,
    saleDate: SaleDate,
    brandID: BrandID?._id,
    totalPurchaseAmount,
    supplierName: SupplierName,
    warehouseID: warehouseID?._id,
    reason,
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  // Handling Input Change for input fields
  const handleInputChange = (key, value) => {
    setWriteOff({ ...writeOff, [key]: value });
  };

  // POST Data
  const updateWriteOff = async () => {
    if (!writeOff.productID || !writeOff.stockSold || !writeOff.saleDate) {
      toastMessage(
        "Please fill in all fields for each writeOff",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    if (writeOff?.saleDate) {
      writeOff.saleDate = moment(new Date(writeOff.saleDate)).format(
        "YYYY-MM-DD HH:mm"
      );
    }

    try {
      await WriteOffService.update(
        writeOff,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );

      toastMessage("WriteOff UPDATED", TOAST_TYPE.TYPE_SUCCESS);
      fetchWriteOffData();
      updateModalSetting();
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  return (
    // Modal
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
                      Writeoff Details
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
                        value={writeOff.productID}
                        disabled={true}
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
                        value={writeOff?.brandID || ""}
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
                        htmlFor="stockSold"
                        className="block text-sm font-medium text-gray-700 text-left"
                      >
                        Stock WriteOff
                      </label>
                      <input
                        type="number"
                        name="stockSold"
                        id="stockSold"
                        disabled={
                          ![
                            ROLES.HIDE_MASTER_SUPER_ADMIN,
                            ROLES.SUPER_ADMIN,
                          ].includes(authContext?.user?.roleID?.name)
                        }
                        value={writeOff.stockSold}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                        disabled={true}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                        value={writeOff.warehouseID}
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
                          writeOff?.saleDate ? new Date(writeOff.saleDate) : ""
                        }
                        // selected={writeOff.saleDate ? new Date(writeOff.saleDate.split("-")[2], writeOff.saleDate.split("-")[1] - 1, writeOff.saleDate.split("-")[0]) : ""}
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
                          handleInputChange("saleDate", date);
                        }}
                      />
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
                        value={writeOff.reason}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter Reason Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-xl mt-2">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={updateWriteOff}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => updateModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
