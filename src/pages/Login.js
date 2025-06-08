import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { toastMessage } from "../utils/handler";
import { TOAST_TYPE } from "../utils/constant";
import AuthService from "../services/AuthService";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toastMessage(
        "Please fill in both email and password.",
        TOAST_TYPE.TYPE_ERROR
      );
      return;
    }

    setLoading(true);

    try {
      await AuthService.login(form);
      toastMessage("Login successful!", TOAST_TYPE.TYPE_SUCCESS);

      const data = await AuthService.me(); // get user data fresh
      authContext.signin(data.data.user, () => {
        navigate("/");
      });
    } catch (error) {
      toastMessage(error.message || "Login failed", TOAST_TYPE.TYPE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Left Logo Section */}
        <div className="hidden md:flex flex-col items-center justify-center bg-indigo-600 p-10">
          <h2 className="text-white text-xl font-semibold mb-4">
            Inventory Management
          </h2>
          <img
            src={require("../assets/demo-logo.jpg")}
            alt="Demo Logo"
            className="max-w-xs"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full p-8 md:p-12">
          <div className="text-center">
            <img
              className="mx-auto h-12"
              src={require("../assets/logo.png")}
              alt="Your Company"
            />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={loginUser}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
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

            <button
              type="submit"
              className="w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
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
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
