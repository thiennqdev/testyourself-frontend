import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navTabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Browse Quizzes", href: "/browse" },
  { label: "My Quizzes", href: "/courses" },
];

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-[#e8f0f4] flex items-center justify-between px-6 sm:px-10 h-16 select-none sticky top-0 z-20">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <img
          src="/Logo.png"
          alt="CourseMaster logo"
          className="w-6 h-6"
        />
        <span className="text-teal-600 font-semibold text-lg leading-none">
          TestYourself
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
        {navTabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.href}
            className={
              pathname.startsWith(tab.href)
                ? "bg-white/70 rounded-full px-4 py-2 text-gray-900 shadow-sm"
                : "hover:text-gray-900"
            }
          >
            {tab.label}
          </Link>
        ))}

        {/* Admin tab - chỉ hiện nếu là ADMIN */}
        {role === "ADMIN" && (
          <Link to="/admin/dashboard" className="text-teal-600 hover:underline">
            Admin
          </Link>
        )}

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">{name}</span>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-500 text-xs"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
