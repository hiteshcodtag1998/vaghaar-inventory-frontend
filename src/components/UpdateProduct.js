import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import ProductService from "../services/ProductService";
import AuthContext from "../AuthContext";

export default function UpdateProduct({
  updateProductData,
  updateModalSetting,
  fetchProductsData,
  brands,
}) {
  const { _id, name, manufacturer, description, BrandID } = updateProductData;

  const authContext = useContext(AuthContext);

  const [product, setProduct] = useState({
    productID: _id,
    name: name,
    manufacturer: manufacturer,
    description: description,
    brandId: BrandID?._id,
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const updateProduct = async () => {
    try {
      await ProductService.update(
        product,
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      toastMessage("Product Updated", TOAST_TYPE.TYPE_SUCCESS);
      fetchProductsData();
      setOpen(false);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Modal Header */}
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <PlusIcon
                        className="h-5 w-5 text-blue-600"
                        aria-hidden="true"
                      />
                    </div> */}

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900">
                      Update Product
                    </h2>
                  </div>
                </div>

                {/* Update Product Form */}
                <div className="space-y-10">
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={(e) =>
                            handleInputChange(e.target.name, e.target.value)
                          }
                          placeholder="e.g. Apple iMac 27”"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          name="manufacturer"
                          value={product.manufacturer}
                          onChange={(e) =>
                            handleInputChange(e.target.name, e.target.value)
                          }
                          placeholder="e.g. Apple"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Brand
                        </label>
                        <select
                          name="brandId"
                          value={product.brandId || ""}
                          onChange={(e) =>
                            handleInputChange("brandId", e.target.value)
                          }
                          disabled={
                            ![
                              ROLES.HIDE_MASTER_SUPER_ADMIN,
                              ROLES.SUPER_ADMIN,
                            ].includes(authContext?.user?.roleID?.name)
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                        >
                          <option value="">Select Brand</option>
                          {brands.map((b) => (
                            <option key={b._id} value={b._id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end">
                        {/* If you want an Add Brand button here, you can add it */}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        name="description"
                        value={product.description}
                        onChange={(e) =>
                          handleInputChange(e.target.name, e.target.value)
                        }
                        placeholder="Product description..."
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={() => updateModalSetting()}
                    ref={cancelButtonRef}
                    className="mt-2 sm:mt-0 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={updateProduct}
                    className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    Update Product
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
