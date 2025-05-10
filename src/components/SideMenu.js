import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlDocs } from "react-icons/sl";
import { RxDashboard } from "react-icons/rx";
import { RiFileDamageFill, RiBarChart2Line } from "react-icons/ri";
import { BiPurchaseTag, BiTransfer } from "react-icons/bi";
import { MdHistory, MdOutlineInventory, MdOutlineWarehouse } from "react-icons/md";

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("inventory");
  const location = useLocation();
  const pathnameParts = location.pathname.split('/');
  const secondPart = pathnameParts[1]; // Index 0 will be empty since pathname starts with a slash

  return (
    <div className="h-full flex-col justify-between  bg-white hidden lg:flex ">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          <Link
            to="/"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 rounded-lg hover:bg-gray-100 px-4 py-2 ${secondPart === "dashboard" || secondPart === "" ? "text-yellow-500" : "text-gray-700"}`}
          >
            <RxDashboard />
            <span className="text-sm font-medium"> Dashboard </span>
          </Link>

          <Link to="/inventory"
            onClick={() => setActiveTab("inventory")}

          >
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${secondPart == "inventory" ? "text-yellow-500" : "text-gray-500"} hover:bg-gray-100`}>
                <div className="flex items-center gap-2">
                  <MdOutlineInventory />
                  <span className="text-sm font-medium"> Inventory </span>
                </div>
              </summary>
            </details>
          </Link>

          <Link
            to="/purchase-details"
            onClick={() => setActiveTab("purchase")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${secondPart == "purchase-details" ? "text-yellow-500" : "text-gray-500"} hover:bg-gray-100`}
          >
            <BiPurchaseTag />
            <span className="text-sm font-medium"> Purchase Details</span>
          </Link>
          <Link
            to="/sales"
            onClick={() => setActiveTab("sales")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${secondPart == "sales" ? "text-yellow-500" : "text-gray-500"} text-gray-500 hover:bg-gray-100`}
          >
            <RiBarChart2Line />
            <span className="text-sm font-medium"> Sales</span>
          </Link>
          <Link
            to="/transferstock"
            onClick={() => setActiveTab("transferstock")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${secondPart == "transferstock" ? "text-yellow-500" : "text-gray-500"} hover:bg-gray-100`}
          >
            <BiTransfer />
            <span className="text-sm font-medium"> Transfer Stock</span>
          </Link>
          <Link
            to="/writeoff"
            onClick={() => setActiveTab("writeoff")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${secondPart == "writeoff" ? "text-yellow-500" : "text-gray-500"} hover:bg-gray-100`}
          >
            <RiFileDamageFill />
            <span className="text-sm font-medium"> Write Off</span>
          </Link>
          <Link
            to="/warehouse"
            onClick={() => setActiveTab("warehouse")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${secondPart == "warehouse" ? "text-yellow-500" : "text-gray-500"} hover:bg-gray-100`}
          >
            <MdOutlineWarehouse />
            <span className="text-sm font-medium"> Warehouses</span>
          </Link>
          {/* For future ref
          <Link
            to="/report"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100"
          >
            <SlDocs />
            <span className="text-sm font-medium"> Report</span>
          </Link> */}

          {/* Comment for future ref
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100">
              <Link to="/manage-store">
                <div className="flex items-center gap-2">
                  <MdOutlineStorefront />
                  <span className="text-sm font-medium"> Manage Store </span>
                </div>
              </Link>
            </summary>
          </details> */}

          <Link to="/history"
            onClick={() => setActiveTab("history")}
          >
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${secondPart == "history" ? "text-yellow-500" : "text-gray-500"} hover:bg-gray-100`}>
                <div className="flex items-center gap-2">
                  <MdHistory />
                  <span className="text-sm font-medium"> History </span>
                </div>
              </summary>
            </details>
          </Link>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 md:flex-row flex-col">
          <img
            alt="Profile"
            src={`https://eu.ui-avatars.com/api/?name=${localStorageData.firstName}+${localStorageData.lastName}&size=250`}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="flex flex-col md:ml-2 ml-0 mt-2 md:mt-0">
            <p className="text-xs break-all">
              <strong className="block font-medium">
                {localStorageData.firstName + " " + localStorageData.lastName} {" "} ({localStorageData?.roleID?.name})
              </strong>
              <span className="break-all"> {localStorageData.email} </span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SideMenu;
