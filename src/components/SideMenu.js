import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdOutlineInventory,
  MdOutlineWarehouse,
  MdHistory,
} from "react-icons/md";
import { RiFileDamageFill, RiBarChart2Line } from "react-icons/ri";
import { BiPurchaseTag, BiTransfer } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import AuthContext from "../AuthContext";

const menuItems = [
  { name: "Dashboard", to: "/", icon: <RxDashboard />, key: "" },
  {
    name: "Inventory",
    to: "/inventory",
    icon: <MdOutlineInventory />,
    key: "inventory",
  },
  {
    name: "Purchase Details",
    to: "/purchase-details",
    icon: <BiPurchaseTag />,
    key: "purchase-details",
  },
  { name: "Sales", to: "/sales", icon: <RiBarChart2Line />, key: "sales" },
  {
    name: "Transfer Stock",
    to: "/transferstock",
    icon: <BiTransfer />,
    key: "transferstock",
  },
  {
    name: "Write Off",
    to: "/writeoff",
    icon: <RiFileDamageFill />,
    key: "writeoff",
  },
  {
    name: "Warehouses",
    to: "/warehouse",
    icon: <MdOutlineWarehouse />,
    key: "warehouse",
  },
  { name: "History", to: "/history", icon: <MdHistory />, key: "history" },
];

function SideMenu() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const currentTab = location.pathname.split("/")[1];

  const userName = `${user?.firstName ?? "N/A"} ${user?.lastName ?? ""}`.trim();
  const roleName = user?.roleID?.name ?? "No role";
  const email = user?.email ?? "No email";

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map(({ name, to, icon, key }) => {
            const isActive = currentTab === key;
            return (
              <Link
                key={name}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-colors text-sm font-medium
                  ${
                    isActive
                      ? "bg-yellow-100 text-yellow-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{icon}</span>
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sticky User Section */}
      <div className="sticky bottom-0 border-t p-4 flex items-center gap-3 bg-white z-10">
        <img
          src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(
            userName
          )}&size=250`}
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover border"
        />
        <div className="text-sm">
          <p className="font-medium text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">{roleName}</p>
          <p className="text-xs text-gray-400 truncate w-40">{email}</p>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
