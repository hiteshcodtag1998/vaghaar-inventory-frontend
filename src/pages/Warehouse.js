import React, { useState, useEffect } from "react";
import AddStore from "../components/AddStore";
import AddWarehouse from "../components/AddWarehouse";
import { MdEdit } from "react-icons/md";
import { Tooltip } from "@mui/material";
import UpdateWarehouse from "../components/UpdateWarehouse";

function Warehouse() {
    const [showModal, setShowModal] = useState(false);
    const [warehouse, setAllWarehouse] = useState([]);
    const [added, setAdded] = useState();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateWarehouse, setUpdateProduct] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [added === true]);

    useEffect(() => {
        if (!showModal)
            setAdded(false)
    }, [showModal]);

    // Fetching all warehouse data
    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}warehouse/get`)
            .then((response) => response.json())
            .then((data) => {
                setAllWarehouse(data);
            });
    };

    const modalSetting = () => {
        setShowModal(!showModal);
    };

    // Modal for Product UPDATE
    const updateWarehouseModalSetting = (selectedProductData) => {
        setShowUpdateModal(!showUpdateModal);
        setUpdateProduct(selectedProductData);
    };

    return (
        <div className="col-span-12 lg:col-span-10 flex justify-center ">
            <div className=" flex flex-col gap-5 w-11/12 overflow-x-auto rounded-lg border bg-white border-gray-200">
                <div className="flex justify-between">
                    <span className="font-bold mt-5 ml-4">Manage Warehouse</span>
                    <button
                        className="mt-5 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                        onClick={modalSetting}
                    >
                        Add Warehouse
                    </button>
                </div>
                {showModal && <AddWarehouse setAdded={setAdded} updateWarehouseModalSetting={modalSetting} />}
                {showUpdateModal && (
                    <UpdateWarehouse
                        updateWarehouseData={updateWarehouse}
                        updateModalSetting={updateWarehouseModalSetting}
                        fetchWarehouseData={fetchData}

                    />
                )}
                {
                    warehouse?.length === 0 ? <div
                        className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                    >
                        <div className="flex flex-col gap-3 justify-between items-start">
                            <span>No data found</span>
                        </div>
                    </div>
                        :
                        <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                            <thead>
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Warehouse Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Location
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {
                                    warehouse?.length === 0 && <div
                                        className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                                    >
                                        <div className="flex flex-col gap-3 justify-between items-start">
                                            <span>No data found</span>
                                        </div>
                                    </div>
                                }
                                {warehouse.map((element, index) => {
                                    return (
                                        <tr key={element._id}>
                                            <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                                                {element.name || ""}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                <div className="flex">
                                                    <img
                                                        alt="location-icon"
                                                        className="h-6 w-6"
                                                        src={require("../assets/location-icon.png")}
                                                    />
                                                    <span>{element.address + ", " + element.city}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                <div className="flex">
                                                    <Tooltip title="Edit" arrow>
                                                        <span
                                                            className="text-green-700 cursor-pointer"
                                                            onClick={() => updateWarehouseModalSetting(element)}
                                                        >
                                                            <MdEdit />
                                                        </span>
                                                    </Tooltip>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                }
                {/* {warehouse.map((element, index) => {
                    return (
                        <div
                            className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                            key={element._id}
                        >
                            <div>
                                {
                                    element?.image && <img
                                        alt="store"
                                        className="h-60 w-full object-cover"
                                        src={element.image}
                                    />
                                }

                            </div>
                            <div className="flex flex-col gap-3 justify-between items-start">
                                <span className="font-bold">{element.name}</span>
                                <div className="flex">
                                    <img
                                        alt="location-icon"
                                        className="h-6 w-6"
                                        src={require("../assets/location-icon.png")}
                                    />
                                    <span>{element.address + ", " + element.city}</span>
                                </div>
                            </div>
                        </div>
                    );
                })} */}
            </div>
        </div>
    );
}

export default Warehouse;
