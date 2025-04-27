import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import MovieList from "./pages/MovieList";
import UsersPage from "./pages/UsersPage";
import AddMovie from "./components/AddMovie";
import AddBanner from "./pages/AddBanner";
import AddUser from "./components/AddUser";
import AddCategory from "./pages/AddCategory";
import Login from "./pages/Login";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  // Logout function to clear localStorage and update auth state
  const handleLogout = () => {
    localStorage.removeItem("is_authenticated");
    setIsAuth(false);
  };

  // Correct login function
  const handleLogin = () => {
    localStorage.setItem("is_authenticated", "true");
    setIsAuth(true); // Corrected here to set user as authenticated
  };

  useEffect(() => {
    if (localStorage.getItem("is_authenticated")) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []); // Empty dependency array to run only once

  // If the user is logged in, redirect them from the login page to the dashboard
  const ProtectedRoute = ({ element }) => {
    if (!isAuth) {
      return <Navigate to="/login" />;
    }
    return element;
  };

  // If the user is already authenticated, they should not access the login page
  const AuthRoute = ({ element }) => {
    if (isAuth) {
      return <Navigate to="/" />;
    }
    return element;
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar logout={handleLogout} /> {/* Pass logout function to Sidebar */}
        <div className="flex flex-col flex-1">
          <Header isAuth={isAuth} />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/login" element={<AuthRoute element={<Login login={handleLogin} />} />} />

              {/* Protected Routes */}
              <Route path="/movies" element={<ProtectedRoute element={<MovieList />} />} />
              <Route path="/users" element={<ProtectedRoute element={<UsersPage />} />} />
              <Route path="/add-movies" element={<ProtectedRoute element={<AddMovie />} />} />
              <Route path="/add-banner" element={<ProtectedRoute element={<AddBanner />} />} />
              <Route path="/add-user" element={<ProtectedRoute element={<AddUser />} />} />
              <Route path="/add-category" element={<ProtectedRoute element={<AddCategory />} />} />
              <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
