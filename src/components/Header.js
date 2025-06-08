import { Fragment, useContext } from "react";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import vaghaarLogo from "../assets/vaghaar-logo.svg";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Inventory", href: "/inventory" },
  { name: "Purchase Details", href: "/purchase-details" },
  { name: "Sales", href: "/sales" },
  { name: "Transfer Stock", href: "/transferstock" },
  { name: "Write Off", href: "/writeoff" },
  { name: "Warehouses", href: "/warehouse" },
  { name: "History", href: "/history" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-semibold text-gray-700">
          User not logged in
        </h1>
      </div>
    );
  }

  const {
    firstName = "",
    lastName = "",
    email = "No email",
    imageUrl = "/default-profile.png",
  } = user;

  const isActive = (href) => location.pathname === href;

  const handleSignOut = () => {
    signout(() => navigate("/login"));
  };

  const NavLinkItem = ({ item }) => (
    <Disclosure.Button
      as={Link}
      to={item.href}
      className={classNames(
        isActive(item.href)
          ? "bg-yellow-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white",
        "block rounded-md px-3 py-2 text-base font-medium transition-all"
      )}
    >
      {item.name}
    </Disclosure.Button>
  );

  return (
    <Disclosure
      as="nav"
      className="bg-forest sticky top-0 z-50 shadow-md text-white border-b border-gray-200"
    >
      {({ open }) => (
        <>
          <div className="max-w-full px-4">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={vaghaarLogo}
                  alt="Vaghaar Logo"
                  className="w-12 h-12 object-contain"
                />
                <div className="flex flex-col select-none">
                  <span className="text-lg sm:text-xl font-bold">
                    Inventory Management
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-5">
                <button
                  type="button"
                  title="Notifications"
                  className="text-gray-500 hover:text-yellow-500"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-gray-500 hover:text-yellow-500"
                  aria-label="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-yellow-500">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <NavLinkItem key={item.name} item={item} />
              ))}
            </div>
            <div className="border-t border-gray-200 px-5 py-4 flex items-center gap-3">
              <img
                src={imageUrl}
                alt={`${firstName} ${lastName}`}
                className="h-10 w-10 rounded-full border object-cover"
              />
              <div>
                <p className="text-gray-900 font-semibold text-sm">
                  {firstName} {lastName}
                </p>
                <p className="text-gray-500 text-xs truncate">{email}</p>
              </div>
            </div>
            <div className="px-5 py-3">
              <Disclosure.Button
                as="button"
                onClick={handleSignOut}
                className="w-full text-center rounded-md bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm font-semibold"
              >
                Sign out
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
