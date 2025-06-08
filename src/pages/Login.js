import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { toastMessage } from "../utils/handler";
import { TOAST_TYPE } from "../utils/constant";
import AuthService from "../services/AuthService";
import vaghaarLogo from "../assets/vaghaar-logo.svg";

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

      const data = await AuthService.me();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl">
        {/* Left Brand Section */}
        <div className="hidden md:flex flex-col items-center justify-center bg-[#142217] text-white p-10">
          <img
            src={require("../assets/demo-logo.jpg")}
            alt="Demo Logo"
            className="max-w-[160px] mb-6 shadow-lg rounded"
          />
          <h2 className="text-2xl font-semibold">Inventory Management</h2>
          <p className="text-sm text-gray-300 mt-2 text-center max-w-xs">
            Organize, track, and simplify your inventory processes with ease.
          </p>
        </div>

        {/* Right Form Section */}
        <div className="p-6 sm:p-10 md:p-12 w-full">
          <div className="text-center mb-8">
            <img
              src={vaghaarLogo}
              alt="Vaghaar Logo"
              className="w-14 h-14 mx-auto object-contain"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <form className="space-y-6" onSubmit={loginUser}>
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
                  value={form.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#142217] focus:border-[#142217] sm:text-sm"
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
                  value={form.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#142217] focus:border-[#142217] sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center bg-[#142217] hover:bg-[#1e3c2a] transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#142217]"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* <div className="mt-6 text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#142217] font-medium hover:underline"
            >
              Register here
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
