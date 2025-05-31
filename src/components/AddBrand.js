import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AuthContext from "../AuthContext";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import BrandService from "../services/BrandService";

export default function AddBrand({ addBrandModalSetting, handlePageUpdate }) {
  const authContext = useContext(AuthContext);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));
  const [brand, setBrand] = useState({
    userId: authContext.user?._id,
    name: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setBrand({ ...brand, [key]: value });
  };

  const addBrand = async () => {
    try {
      await BrandService.add(brand, myLoginUser?.roleID?.name);
      toastMessage("Brand ADDED", TOAST_TYPE.TYPE_SUCCESS);
      handlePageUpdate();
      addBrandModalSetting();
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
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                Add New Brand
              </Dialog.Title>

              <p className="mt-1 text-sm text-gray-500">
                Please enter the name of the brand you'd like to add.
              </p>

              <div className="mt-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={brand.name}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  placeholder="e.g. Samsung"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => addBrandModalSetting()}
                  ref={cancelButtonRef}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addBrand}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Brand
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
