import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50">
          <Header />
        </div>
        {/* Main Content */}
        <div className="flex flex-1 bg-gray-100">
          {/* Sidebar */}
          <div className="hidden lg:flex col-span-2 h-screen sticky top-0 bg-white">
            <SideMenu />
          </div>
          {/* Main Outlet Content */}
          <div className="flex-1 py-4">
            <Outlet />
          </div>
        </div>
      </div>

    </>
  );
}

export default Layout;
