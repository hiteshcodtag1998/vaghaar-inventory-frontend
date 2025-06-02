import React, { useState, useEffect, useContext } from "react";
import AddWarehouse from "../components/AddWarehouse";
import { MdAdd, MdEdit } from "react-icons/md";
import { Tooltip } from "@mui/material";
import UpdateWarehouse from "../components/UpdateWarehouse";
import { toastMessage } from "../utils/handler";
import { TOAST_TYPE } from "../utils/constant";
import AuthContext from "../AuthContext";
import WarehouseService from "../services/WarehouseService";

function Warehouse() {
  const authContext = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [warehouse, setAllWarehouse] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateWarehouse, setUpdateProduct] = useState([]);

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  // Fetching all warehouse data
  const fetchWarehouseData = async () => {
    try {
      const data = await WarehouseService.getAll(
        authContext?.roleID?.name,
        authContext.user?._id
      );
      setAllWarehouse(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  const updateWarehouseModalSetting = (selectedProductData) => {
    setShowUpdateModal(!showUpdateModal);
    setUpdateProduct(selectedProductData);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center ">
      <div className="flex flex-col gap-5 w-11/12 overflow-x-auto rounded-lg border bg-white border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 border-b bg-white rounded-t-md">
          <h2 className="text-lg font-semibold text-gray-800">
            Manage Warehouse
          </h2>
          <button
            onClick={modalSetting}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
          >
            <MdAdd className="w-5 h-5" />
            Add Warehouse
          </button>
        </div>

        {showModal && (
          <AddWarehouse
            fetchWarehouseData={fetchWarehouseData}
            updateWarehouseModalSetting={modalSetting}
          />
        )}

        {showUpdateModal && (
          <UpdateWarehouse
            updateWarehouseData={updateWarehouse}
            updateModalSetting={updateWarehouseModalSetting}
            fetchWarehouseData={fetchWarehouseData}
          />
        )}

        {warehouse?.length === 0 ? (
          <div className="bg-white w-50 h-fit flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-3 justify-between items-start">
              <span>No data found</span>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Warehouse Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Location
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {warehouse.map((element) => (
                <tr key={element._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">
                    {element.name || ""}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <div className="flex items-center gap-2">
                      <img
                        alt="location-icon"
                        className="h-5 w-5"
                        src={require("../assets/location-icon.png")}
                      />
                      <span>{element.address + ", " + element.city}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <div className="flex gap-2 items-center">
                      <Tooltip title="Edit" arrow>
                        <span
                          className="text-green-600 cursor-pointer"
                          onClick={() => updateWarehouseModalSetting(element)}
                        >
                          <MdEdit />
                        </span>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Warehouse;
