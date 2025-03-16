import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCouponContext } from "../context/CouponContext";
import AdminLoginForm from "../components/AdminLoginForm";
import api from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const { loading, error, adminInfo, dispatch } = useCouponContext();

  useEffect(() => {
    // Redirect if already logged in
    if (adminInfo) {
      navigate("/admin");
    }
  }, [adminInfo, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      // Clear error after showing toast
      setTimeout(() => {
        dispatch({ type: "CLEAR_ERROR" });
      }, 5000);
    }
  }, [error, dispatch]);

  const handleLogin = async (credentials) => {
    try {
      dispatch({ type: "REQUEST_START" });
      const { data } = await api.post("/admin/login", credentials);

      // Save to local storage
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data));

      dispatch({
        type: "ADMIN_LOGIN_SUCCESS",
        payload: data,
      });

      navigate("/admin");
    } catch (error) {
      dispatch({
        type: "REQUEST_FAIL",
        payload:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Admin Login
        </h1>
        <AdminLoginForm onLogin={handleLogin} isLoading={loading} />
      </div>
      <div className="mt-4">
        <a href="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
          ← Back to Home
        </a>
      </div>
    </div>
  );
};

export default Login;
