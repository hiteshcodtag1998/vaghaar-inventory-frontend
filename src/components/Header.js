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
    signout(() => {
      navigate("/login");
    });
  };

  const NavLinkItem = ({ item }) => (
    <Disclosure.Button
      as={Link}
      to={item.href}
      className={classNames(
        isActive(item.href)
          ? "bg-yellow-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white",
        "block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
      )}
      aria-current={isActive(item.href) ? "page" : undefined}
    >
      {item.name}
    </Disclosure.Button>
  );

  return (
    <Disclosure as="nav" className="bg-gray-900 sticky top-0 z-50 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo / Title */}
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-bold text-yellow-400 select-none">
                  Vaghaar Inventory
                </span>
              </div>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-5">
                <button
                  type="button"
                  aria-label="View notifications"
                  className="rounded-full p-2 text-gray-400 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <BellIcon className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  className="rounded-full p-2 text-gray-400 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button
                  aria-label={open ? "Close menu" : "Open menu"}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="md:hidden bg-gray-900">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLinkItem key={item.name} item={item} />
              ))}
            </div>

            {/* User Info */}
            <div className="border-t border-yellow-600 pt-4 pb-3 px-5 flex items-center">
              <img
                className="h-10 w-10 rounded-full border-2 border-yellow-400 object-cover"
                src={imageUrl}
                alt={`${firstName} ${lastName} avatar`}
                loading="lazy"
              />
              <div className="ml-3 flex-1">
                <p className="text-base font-semibold text-white truncate">
                  {firstName} {lastName}
                </p>
                <p className="text-sm text-yellow-300 truncate">{email}</p>
              </div>
              <button
                type="button"
                aria-label="View notifications"
                className="p-1 rounded-full text-gray-400 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <BellIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Sign out */}
            <div className="mt-3 space-y-1 px-5">
              <Disclosure.Button
                as="button"
                onClick={handleSignOut}
                className="block w-full rounded-md bg-yellow-600 px-3 py-2 text-center text-base font-semibold text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
