import { useLocation } from "react-router-dom";

export default function Header({ isAuth }) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/movies':
        return 'Movies List';
      case '/users':
        return 'Users';
      case '/add-movies':
        return 'Add Movie';
      case '/add-banner':
        return 'Add Banner';
      case '/add-user':
        return 'Add User';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Left side (Logo + Title + Mobile toggle button) */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button (visible on small screens) */}
          <button
            aria-label="Toggle sidebar"
            className="text-gray-500 focus:outline-none lg:hidden"
            id="sidebarToggle"
          >
            <i className="fas fa-bars fa-lg"></i>
          </button>

          {/* Page Title */}
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side (Profile Section) */}


        {isAuth === true ? (<div className="flex items-center space-x-4">
          {/* User Menu Button */}
          <button
            aria-label="User menu"
            type="button"
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src="https://storage.googleapis.com/a1aa/image/20087f06-db7a-467a-e365-52097f94196e.jpg"
              alt="User Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            {/* Hide Admin text on very small screens */}
            <span className="hidden sm:inline-block text-gray-700 font-medium">Admin</span>
            <i className="fas fa-chevron-down text-gray-500 text-sm"></i>
          </button>
        </div>) : <h2>Login</h2>}
      </div>
    </header>
  );
}
