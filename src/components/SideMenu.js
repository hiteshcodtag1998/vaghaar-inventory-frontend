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
    <div className="h-full flex flex-col bg-forest text-white">
      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <nav className="flex flex-col gap-1">
          {menuItems.map(({ name, to, icon, key }) => {
            const isActive = currentTab === key;
            return (
              <Link
                key={name}
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-yellow-600 text-white shadow"
                      : "text-gray-300 hover:bg-white/10 hover:text-yellow-400"
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

      {/* User Info Footer */}
      <div className="sticky bottom-0 w-full border-t border-white/10 px-4 py-4 flex items-center gap-3 bg-[rgb(20,34,23)] z-10">
        <img
          src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(
            userName
          )}&size=250&background=142217&color=fff`}
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover border border-white"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">
            {userName}
          </p>
          <p className="text-xs text-gray-400 truncate">{roleName}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
