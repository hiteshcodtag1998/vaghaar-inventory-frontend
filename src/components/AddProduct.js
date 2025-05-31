import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import AddBrand from "./AddBrand";
import ProductService from "../services/ProductService";
import { FiTrash } from "react-icons/fi";

export default function AddProduct({
  addProductModalSetting,
  handlePageUpdate,
  brands,
}) {
  const authContext = useContext(AuthContext);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([
    {
      userId: authContext.user?._id,
      name: "",
      brandId: "",
      description: "",
      manufacturer: "",
    },
  ]);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [showBrandModal, setBrandModal] = useState(false);

  const handleInputChange = (index, key, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [key]: value };
    setProducts(updatedProducts);
  };

  const addProduct = async () => {
    if (products?.length === 0) {
      toastMessage("Please add product form", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    const hasEmptyField = products.some(
      (product) =>
        !product.name.trim() || !product.brandId || !product.description.trim()
    );

    if (hasEmptyField) {
      toastMessage(
        "Please fill in all fields for each product",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    try {
      await ProductService.add(
        products,
        myLoginUser?.roleID?.name,
        myLoginUser?._id
      );
      toastMessage("Product ADDED", TOAST_TYPE.TYPE_SUCCESS);
      handlePageUpdate();
      addProductModalSetting();
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const handleAddForm = () => {
    setProducts([
      ...products,
      { userId: authContext.user?._id, name: "", brand: "", description: "" },
    ]);
  };

  const removeForm = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleOpenBrand = () => {
    setBrandModal(true);
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
          <div className="fixed inset-0 bg-black/50" />
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
                      >
                        <PlusIcon
                          className="h-5 w-5 text-blue-600"
                          aria-hidden="true"
                          onClick={handleAddForm}
                        />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md z-10">
                        Add new product
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900">
                      Add Product
                    </h2>
                  </div>
                </div>

                {/* Dynamic Product Forms */}
                <div className="space-y-10">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="border-t border-gray-200 pt-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Product #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeForm(index)}
                          className="text-red-600 hover:text-red-800 text-sm p-1 rounded transition"
                          aria-label="Remove"
                          title="Remove product"
                        >
                          <FiTrash className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
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
                            value={product.manufacturer}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "manufacturer",
                                e.target.value
                              )
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
                            value={product.brandId}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "brandId",
                                e.target.value
                              )
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
                          <button
                            type="button"
                            onClick={handleOpenBrand}
                            className="w-full rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:ring focus:ring-purple-300"
                          >
                            Add New Brand
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          value={product.description}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Product description..."
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={addProductModalSetting}
                    ref={cancelButtonRef}
                    className="mt-2 sm:mt-0 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    Save Product
                  </button>
                </div>

                {showBrandModal && (
                  <AddBrand
                    addBrandModalSetting={() => setBrandModal(false)}
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
