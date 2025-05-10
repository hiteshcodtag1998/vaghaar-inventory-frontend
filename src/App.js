import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import History from "./pages/History";
import Warehouse from "./pages/Warehouse";
import WriteOffDetails from "./pages/WriteOff";
import TransferStockDetails from "./pages/TransferStock";
import Report from "./pages/Report";

const App = () => {

  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(false);
  const myLoginUser = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    localStorage.clear();
    setUser(null);
  };

  let value = { user, signin, signout };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase-details" element={<PurchaseDetails />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/manage-store" element={<Store />} />
            <Route path="/history" element={<History />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/writeoff" element={<WriteOffDetails />} />
            <Route path="/report" element={<Report />} />
            <Route path="/transferstock" element={<TransferStockDetails />} />

          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
