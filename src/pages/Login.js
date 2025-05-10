import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { toastMessage } from "../utils/handler";
import { TOAST_TYPE } from "../utils/constant";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Loader state

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authCheck = () => {
    setTimeout(() => {
      fetch(`${process.env.REACT_APP_API_BASE_URL}login`)
        .then((response) => response.json())
        .then((data) => {
          toastMessage("Successfully Login", TOAST_TYPE.TYPE_SUCCESS);
          localStorage.setItem("user", JSON.stringify(data));
          authContext.signin(data, () => {
            navigate("/");
          });
        })
        .catch(() => {
          toastMessage("Wrong credentials, Try again", TOAST_TYPE.TYPE_ERROR);
        })
        .finally(() => setLoading(false)); // Hide loader
    }, 3000);
  };

  const loginUser = (e) => {
    e.preventDefault();
    if (form.email === "" || form.password === "") {
      toastMessage("To login user, enter details to proceed...", TOAST_TYPE.TYPE_ERROR);
      return;
    }

    setLoading(true); // Show loader

    fetch(`${process.env.REACT_APP_API_BASE_URL}login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((result) => {
        console.log("User login", result);
        authCheck();
      })
      .catch((err) => {
        toastMessage(err?.message || "Something went wrong", TOAST_TYPE.TYPE_ERROR);
        setLoading(false); // Hide loader
      });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
          {/* Left Side - Logo */}
          <div className="hidden md:flex flex-col items-center justify-center bg-indigo-600 p-10">
            <h2 className="text-white text-xl font-semibold mb-4">Inventory Management</h2>
            <img src={require("../assets/demo-logo.jpg")} alt="Demo Logo" className="max-w-xs" />
          </div>

          {/* Right Side - Form */}
          <div className="w-full p-8 md:p-12">
            <div className="text-center">
              <img className="mx-auto h-12" src={require("../assets/logo.png")} alt="Your Company" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={loginUser}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    value={form.email}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                    value={form.password}
                  />
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <a href="#" className="text-sm text-indigo-600 hover:underline">
                  Forgot your password?
                </a>
              </div> */}

              <button
                type="submit"
                className="w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Sign in"
                )}

                {/* <p className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account? <a href="/register" className="text-indigo-600 hover:underline">Register now</a>
            </p> */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
