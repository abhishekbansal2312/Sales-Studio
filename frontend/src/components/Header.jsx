import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-rose-500 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          to="/"
          className="text-3xl font-bold tracking-wide hover:text-rose-200 transition"
        >
          Sales Studio
        </Link>

        <nav>
          <ul className="flex space-x-6 text-lg">
            <li>
              <Link to="/" className="hover:text-rose-200 transition">
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-rose-200 transition"
                  >
                    My Coupons
                  </Link>
                </li>

                {user.isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className="hover:text-rose-200 transition"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-rose-600 px-4 py-2 rounded-lg shadow-md hover:bg-rose-100 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-rose-200 transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-rose-200 transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
