import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Scrollable if content overflows */}
        <div className="hidden lg:block w-64 bg-white border-r overflow-y-auto">
          <SideMenu />
        </div>

        {/* Main Content: Scrolls independently */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
