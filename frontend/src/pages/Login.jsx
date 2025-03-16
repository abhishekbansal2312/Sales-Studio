import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import UserLoginForm from "../components/UserLoginForm";
import AdminLoginForm from "../components/AdminLoginForm";

const Login = () => {
  const [activeTab, setActiveTab] = useState("user");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-rose-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex justify-between border-b pb-2 mb-4">
          <button
            className={`w-1/2 text-center py-2 font-semibold text-lg transition ${
              activeTab === "user"
                ? "border-b-4 border-rose-500 text-rose-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User Login
          </button>
          <button
            className={`w-1/2 text-center py-2 font-semibold text-lg transition ${
              activeTab === "admin"
                ? "border-b-4 border-rose-500 text-rose-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Login
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "user" ? <UserLoginForm /> : <AdminLoginForm />}
        </div>
      </div>
    </div>
  );
};

export default Login;
