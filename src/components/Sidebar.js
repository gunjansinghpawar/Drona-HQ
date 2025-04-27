import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({logout}) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "fas fa-tachometer-alt", path: "/" },
    { name: "Movies", icon: "fas fa-film", path: "/movies" },
    { name: "Users", icon: "fas fa-users", path: "/users" },
    { name: "Add Category", icon: "fas fa-th-list", path: "/add-category" },
    { name: "Add Banner", icon: "fas fa-user-plus", path: "/add-banner" },
  ];

const handleLogout = () => {
  logout();
  navigate("/login");
};

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        aria-label="Sidebar"
        className={`fixed z-40 inset-y-0 left-0 w-64 transform bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after clicking
            >
              <i className={`${item.icon} mr-3 w-5 text-center`}></i>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 border-t border-gray-200">
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed z-50 top-4 left-4 p-2 bg-white border rounded-md shadow-md text-gray-700 lg:hidden"
      >
        <i className="fas fa-bars"></i>
      </button>
    </>
  );
}
