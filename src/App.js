import { useEffect, useState } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import AuthContext from "./AuthContext";
import AuthService from "./services/AuthService";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await AuthService.me();
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoader(false);
      }
    };

    initializeAuth();
  }, []);

  const signin = (user, callback = () => {}) => {
    setUser(user);
    callback();
  };

  const signout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const authContextValue = { user, signin, signout };
  console.log("authContextValue", authContextValue);

  if (loader) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
