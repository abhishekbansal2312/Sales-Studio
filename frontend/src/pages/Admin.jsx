/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useCouponContext } from "../context/CouponContext";
import AdminDashboard from "../components/AdminDashboard";
import CouponList from "../components/CouponList";
import CouponForm from "../components/CouponForm";
import api from "../api/api";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminInfo, loading, error, coupons, claims, dispatch } =
    useCouponContext();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
      // Clear error after showing toast
      setTimeout(() => {
        dispatch({ type: "CLEAR_ERROR" });
      }, 5000);
    }
  }, [error, dispatch]);

  useEffect(() => {
    fetchCoupons();
    fetchClaims();
  }, []);

  const fetchCoupons = async () => {
    try {
      dispatch({ type: "REQUEST_START" });
      const { data } = await api.get("/admin/coupons");
      dispatch({ type: "GET_COUPONS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "REQUEST_FAIL",
        payload: error.response?.data?.message || "Failed to fetch coupons",
      });
    }
  };

  const fetchClaims = async () => {
    try {
      dispatch({ type: "REQUEST_START" });
      const { data } = await api.get("/admin/claims");
      dispatch({ type: "GET_CLAIMS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "REQUEST_FAIL",
        payload: error.response?.data?.message || "Failed to fetch claims",
      });
    }
  };

  const handleAddCoupon = async (couponData) => {
    try {
      dispatch({ type: "REQUEST_START" });
      const { data } = await api.post("/admin/coupons", couponData);
      dispatch({ type: "ADD_COUPON_SUCCESS", payload: data });
      toast.success("Coupon added successfully!");
      setShowCouponForm(false);
    } catch (error) {
      dispatch({
        type: "REQUEST_FAIL",
        payload: error.response?.data?.message || "Failed to add coupon",
      });
    }
  };

  const handleUpdateCoupon = async (id, couponData) => {
    try {
      dispatch({ type: "REQUEST_START" });
      const { data } = await api.put(`/admin/coupons/${id}`, couponData);
      dispatch({ type: "UPDATE_COUPON_SUCCESS", payload: data });
      toast.success("Coupon updated successfully!");
      setEditCoupon(null);
      setShowCouponForm(false);
    } catch (error) {
      dispatch({
        type: "REQUEST_FAIL",
        payload: error.response?.data?.message || "Failed to update coupon",
      });
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        dispatch({ type: "REQUEST_START" });
        await api.delete(`/admin/coupons/${id}`);
        dispatch({ type: "DELETE_COUPON_SUCCESS", payload: id });
        toast.success("Coupon deleted successfully!");
      } catch (error) {
        dispatch({
          type: "REQUEST_FAIL",
          payload: error.response?.data?.message || "Failed to delete coupon",
        });
      }
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setShowCouponForm(true);
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      dispatch({ type: "REQUEST_START" });
      const { data } = await api.put(`/admin/coupons/${id}`, {
        isActive: !isActive,
      });
      dispatch({ type: "UPDATE_COUPON_SUCCESS", payload: data });
      toast.success(
        `Coupon ${data.isActive ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      dispatch({
        type: "REQUEST_FAIL",
        payload:
          error.response?.data?.message || "Failed to update coupon status",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    dispatch({ type: "ADMIN_LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl">Admin Panel</div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className={`hover:text-indigo-200 ${
                location.pathname === "/admin"
                  ? "text-white font-bold"
                  : "text-indigo-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/coupons"
              className={`hover:text-indigo-200 ${
                location.pathname === "/admin/coupons"
                  ? "text-white font-bold"
                  : "text-indigo-100"
              }`}
            >
              Manage Coupons
            </Link>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={<AdminDashboard coupons={coupons} claims={claims} />}
          />
          <Route
            path="/coupons"
            element={
              <>
                {showCouponForm ? (
                  <CouponForm
                    onSubmit={
                      editCoupon
                        ? (data) => handleUpdateCoupon(editCoupon._id, data)
                        : handleAddCoupon
                    }
                    coupon={editCoupon}
                    onCancel={() => {
                      setShowCouponForm(false);
                      setEditCoupon(null);
                    }}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold text-gray-800">
                        Manage Coupons
                      </h1>
                      <button
                        onClick={() => setShowCouponForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                      >
                        Add New Coupon
                      </button>
                    </div>
                    <CouponList
                      coupons={coupons}
                      onEdit={handleEdit}
                      onDelete={handleDeleteCoupon}
                      onToggleStatus={handleToggleStatus}
                    />
                  </>
                )}
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
