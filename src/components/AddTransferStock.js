import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { toastMessage } from "../utils/handler";
import { Button } from "@mui/material";
import AddBrand from "./AddBrand";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";

export default function AddTransferStockDetails({
    addSaleModalSetting,
    products,
    handlePageUpdate,
    authContext,
    brands,
    warehouses
}) {
    const [purchase, setPurchase] = useState({
        userID: authContext.user,
        productID: "",
        quantityPurchased: "",
        purchaseDate: new Date(),
        totalPurchaseAmount: "",
        fromWarehouseID: "",
        toWarehouseID: "",
        brandID: ""
    });
    const myLoginUser = JSON.parse(localStorage.getItem("user"));
    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);
    const [showBrandModal, setBrandModal] = useState(false);

    // Handling Input Change for input fields
    const handleInputChange = (key, value) => {
        let updatedTransferData = { ...purchase };
        if (key === 'productID') {
            const brandInfo = products?.find(p => p._id === value)?.BrandID;
            updatedTransferData = { ...updatedTransferData, brandID: brandInfo?._id };
        }

        updatedTransferData = { ...updatedTransferData, [key]: value }

        setPurchase(updatedTransferData);
    };

    // POST Data
    const addSale = () => {

        // Check if any product field is null or empty
        const hasEmptyField = !purchase || !purchase.productID || !purchase.quantityPurchased || !purchase.purchaseDate;

        // Check if any purchase quantity is less than 1
        const hasFieldLessThanZero = Object.values(purchase).some(p => {
            return (
                p.quantityPurchased < 1
            );
        });

        if (hasEmptyField) {
            toastMessage("Please fill in all fields for each purchase", TOAST_TYPE.TYPE_ERROR);
            return;
        }

        if (hasFieldLessThanZero) {
            toastMessage("Transfer quantity should be grater than zero", TOAST_TYPE.TYPE_ERROR);
            return;
        }

        const payload = { ...purchase, purchaseDate: moment(new Date(purchase.purchaseDate)).format('YYYY-MM-DD HH:mm') }

        fetch(`${process.env.REACT_APP_API_BASE_URL}transferstock/add`, {
            method: "POST",
            headers: {
                role: myLoginUser?.roleID?.name,
                requestBy: myLoginUser?._id,
                "Content-type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json(); // Assuming the error response is in JSON format
                    throw new Error(errorData.message || "Something went wrong on the server");
                }

                toastMessage("TransferStock ADDED", TOAST_TYPE.TYPE_SUCCESS)
                handlePageUpdate();
                addSaleModalSetting();
            })
            .catch((err) => { toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR) });

    };

    const handleOpenBrand = () => {
        setBrandModal(true)
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
                                        {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <PlusIcon
                                                className="h-6 w-6 text-blue-400"
                                                aria-hidden="true"
                                            />
                                        </div> */}
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg  py-4 font-semibold leading-6 text-gray-900 "
                                            >
                                                TransferStock Details
                                            </Dialog.Title>
                                            <form action="#">
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
                                                            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Brand Name
                                                        </label>
                                                        <select
                                                            id="brandID"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            name="brandID"
                                                            value={purchase?.brandID || ''}
                                                            disabled={true}
                                                            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="0 - 999"
                                                        />
                                                    </div>
                                                    {/* <div>
                                                        <label
                                                            htmlFor="supplierName"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Supplier Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="supplierName"
                                                            id="supplierName"
                                                            value={purchase.supplierName}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="Enter Supplier Name"
                                                        />
                                                    </div> */}
                                                    {/* <div>
                                                        <label
                                                            htmlFor="storeName"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Store Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="storeName"
                                                            id="storeName"
                                                            value={purchase.storeName}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="Enter Store Name"
                                                        />
                                                    </div> */}

                                                    <div>
                                                        <label
                                                            htmlFor="fromWarehouseID"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            From Warehouse
                                                        </label>
                                                        <select
                                                            id="fromWarehouseID"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            To Warehouse
                                                        </label>
                                                        <select
                                                            id="toWarehouseID"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            name="toWarehouseID"
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                        >
                                                            <option selected="">Select Warehouse</option>
                                                            {warehouses?.length > 0 && warehouses.filter(w => w._id !== purchase.fromWarehouseID)?.map((element, index) => {
                                                                return (
                                                                    <option key={element._id} value={element._id}>
                                                                        {element.name}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>

                                                    {/* <div>
                                                        <label
                                                            htmlFor="sendingLocation"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Sending Location
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="sendingLocation"
                                                            id="sendingLocation"
                                                            value={purchase.sendingLocation}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="Enter Sending Location"
                                                        />
                                                    </div> */}
                                                    {/* <div>
                                                        <label
                                                            htmlFor="receivingLocation"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Receiving Location
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="receivingLocation"
                                                            id="receivingLocation"
                                                            value={purchase.receivingLocation}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            placeholder="Enter Receiving Location"
                                                        />
                                                    </div> */}

                                                    <div className="h-fit w-full">
                                                        {/* <Datepicker
                              onChange={handleChange}
                              show={show}
                              setShow={handleClose}
                            /> */}

                                                        <label
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            htmlFor="purchaseDate"
                                                        >
                                                            Transfer Date
                                                        </label>
                                                        <DatePicker
                                                            dateFormat="dd-MM-yyyy HH:mm"
                                                            selected={purchase?.purchaseDate ? new Date(purchase.purchaseDate) : new Date()}
                                                            placeholderText="dd-mm-yyyy HH:mm"
                                                            maxDate={new Date()}
                                                            showTimeSelect
                                                            timeIntervals={1}
                                                            disabled={![ROLES.HIDE_MASTER_SUPER_ADMIN, ROLES.SUPER_ADMIN].includes(myLoginUser?.roleID?.name)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            onChange={(date) => {
                                                                handleInputChange('purchaseDate', date)
                                                            }}
                                                        />
                                                        {/* <input
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            type="date"
                                                            id="purchaseDate"
                                                            name="purchaseDate"
                                                            value={purchase.purchaseDate}
                                                            onChange={(e) =>
                                                                handleInputChange(e.target.name, e.target.value)
                                                            }
                                                        /> */}
                                                    </div>
                                                </div>
                                                {/* <div className="flex items-center space-x-4">

                                                    <Button className="pt-10" onClick={handleOpenBrand} variant="contained" color="secondary">
                                                        Add Brand
                                                    </Button>
                                                </div> */}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        onClick={addSale}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => addSaleModalSetting()}
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
        </Transition.Root>
    );
}
