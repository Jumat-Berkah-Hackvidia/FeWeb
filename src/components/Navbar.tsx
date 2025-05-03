import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AIDorseLogo from "@/assets/AIDorseLogo.png";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#3E54AC] shadow-md border-b border-[#2e3b8e]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <img src={AIDorseLogo} alt="AIDorse Logo" className="w-10" />
            <Link to="/" className="text-xl font-bold text-white">
              AIDorse
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm transition ${
                location.pathname === "/"
                  ? "font-semibold text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm transition ${
                location.pathname === "/about"
                  ? "font-semibold text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              About
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm transition ${
                    location.pathname.includes("/dashboard")
                      ? "font-semibold text-white"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white/80 hidden sm:inline">
                    {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    title="Log out"
                    className="text-white hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-[#3E54AC] hover:bg-gray-100"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
