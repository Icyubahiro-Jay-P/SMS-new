import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "border-b-2 border-blue-600" : "";

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">SMS - DAB Enterprise</h1>
          {user && (
            <div className="flex space-x-6 ml-8">
              <Link
                to="/dashboard"
                className={`hover:text-gray-200 ${isActive("/dashboard")}`}
              >
                Dashboard
              </Link>
              <Link
                to="/stock-in"
                className={`hover:text-gray-200 ${isActive("/stock-in")}`}
              >
                Stock In
              </Link>
              <Link
                to="/stock-out"
                className={`hover:text-gray-200 ${isActive("/stock-out")}`}
              >
                Stock Out
              </Link>
              <Link
                to="/items"
                className={`hover:text-gray-200 ${isActive("/items")}`}
              >
                Items
              </Link>
              <Link
                to="/reports"
                className={`hover:text-gray-200 ${isActive("/reports")}`}
              >
                Reports
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.User_Name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
