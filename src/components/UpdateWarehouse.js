import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import UploadImage from "./UploadImage";
import AuthContext from "../AuthContext";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import WarehouseService from "../services/WarehouseService";

export default function UpdateWarehouse({
  updateWarehouseData,
  updateModalSetting,
  fetchWarehouseData,
}) {
  const authContext = useContext(AuthContext);

  const { _id, name, address, city, category } = updateWarehouseData;

  const [form, setForm] = useState({
    warehouseID: _id,
    name,
    category,
    address,
    city,
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const updateWarehouse = async () => {
    try {
      await WarehouseService.update(
        form,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      toastMessage("Warehouse updated", TOAST_TYPE.TYPE_SUCCESS);
      setOpen(false);
      fetchWarehouseData();
      updateModalSetting();
    } catch (err) {
      toastMessage(
        err?.message || "Something went wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <PlusIcon
                          className="h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md z-10">
                        Edit warehouse
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Update Warehouse
                    </h2>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Warehouse name"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="SuperMart">SuperMart</option>
                        <option value="Phones">Phones</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        name="address"
                        rows={3}
                        value={form.address}
                        onChange={handleInputChange}
                        placeholder="Full address"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={updateModalSetting}
                    ref={cancelButtonRef}
                    className="mt-2 sm:mt-0 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={updateWarehouse}
                    className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    Update Warehouse
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
