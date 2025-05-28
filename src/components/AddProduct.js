import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import { TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import { Button } from "@mui/material";
import AddBrand from "./AddBrand";
import ProductService from "../services/ProductService";

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
  console.log("authContext.user?._id", authContext.user?._id);
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                        onClick={handleAddForm}
                      />
                    </div>
                    <div className="text-center sm:mt-2 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Add Product
                      </Dialog.Title>

                      {products.map((product, index) => (
                        <form key={index} action="#">
                          <div className="flex justify-between items-center mt-5">
                            <span className="text-sm font-medium text-gray-700">
                              Product: {index + 1}
                            </span>
                            <div className="flex-1 border-t border-gray-300 mx-2"></div>
                            <button
                              type="button"
                              className="flex justify-center items-center px-2 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white rounded-lg py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                              onClick={() => removeForm(index)}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
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
                                htmlFor={`name_${index}`}
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                name={`name_${index}`}
                                id={`name_${index}`}
                                value={product.name}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Ex. Apple iMac 27&ldquo;"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="manufacturer"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Manufacturer
                              </label>
                              <input
                                type="text"
                                name="manufacturer"
                                id="manufacturer"
                                value={product.manufacturer}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Ex. Apple"
                              />
                            </div>
                          </div>
                          <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="brandId"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Brand Name
                              </label>
                              <select
                                id="brandId"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                name="brandId"
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "brandId",
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
                            <div className="mt-7">
                              <Button
                                className="w-full h-10"
                                onClick={handleOpenBrand}
                                variant="contained"
                                color="secondary"
                              >
                                Add Brand
                              </Button>
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor={`description_${index}`}
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Description
                            </label>
                            <textarea
                              id={`description_${index}`}
                              rows="5"
                              name={`description_${index}`}
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Write a description..."
                              value={product.description}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </form>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={addProduct}
                    >
                      Add Product
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => addProductModalSetting()}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
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
