// src/routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import PurchaseDetails from "../pages/PurchaseDetails";
import Sales from "../pages/Sales";
import Store from "../pages/Store";
import History from "../pages/History";
import Warehouse from "../pages/Warehouse";
import Report from "../pages/Report";
import TransferStockDetails from "../pages/TransferStock";
import WriteOffDetails from "../pages/WriteOff";
import NoPageFound from "../pages/NoPageFound";

import ProtectedWrapper from "../ProtectedWrapper";
import PublicWrapper from "../PublicWrapper";
import Layout from "../components/Layout";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route element={<PublicWrapper />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Protected routes */}
    <Route element={<ProtectedWrapper />}>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="purchase-details" element={<PurchaseDetails />} />
        <Route path="sales" element={<Sales />} />
        <Route path="manage-store" element={<Store />} />
        <Route path="history" element={<History />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="writeoff" element={<WriteOffDetails />} />
        <Route path="report" element={<Report />} />
        <Route path="transferstock" element={<TransferStockDetails />} />
      </Route>
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<NoPageFound />} />
  </Routes>
);

export default AppRoutes;
