import { createContext, useState, useContext } from "react";
import api from "../api/api";

export const CouponContext = createContext();

export const useCouponContext = () => {
  const context = useContext(CouponContext);

  if (!context) {
    throw new Error("useCouponContext must be used within a CouponProvider");
  }

  return context;
};

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Get all coupons (admin)
  const getCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch coupons");
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch coupons",
      };
    }
  };

  // Get next available coupon (public)
  const getNextCoupon = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coupons/next");
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to get next coupon";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  // Claim coupon as guest
  const claimCouponAsGuest = async (couponId) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/coupons/guest-claim/${couponId}`);
      setNotification({
        message: data.message || "Coupon claimed successfully!",
        type: "success",
      });
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to claim coupon";
      setNotification({ message, type: "error" });
      setLoading(false);
      return { success: false, message };
    }
  };

  // Claim coupon as registered user
  const claimCouponAsUser = async (couponId) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/coupons/claim/${couponId}`);
      setNotification({
        message: data.message || "Coupon claimed successfully!",
        type: "success",
      });
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to claim coupon";
      setNotification({ message, type: "error" });
      setLoading(false);
      return { success: false, message };
    }
  };

  // Create coupon (admin)
  const createCoupon = async (couponData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/coupons", couponData);
      setCoupons([data, ...coupons]);
      setNotification({
        message: "Coupon created successfully!",
        type: "success",
      });
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create coupon";
      setNotification({ message, type: "error" });
      setLoading(false);
      return { success: false, message };
    }
  };

  // Update coupon (admin)
  const updateCoupon = async (id, couponData) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/coupons/${id}`, couponData);
      setCoupons(coupons.map((coupon) => (coupon._id === id ? data : coupon)));
      setNotification({
        message: "Coupon updated successfully!",
        type: "success",
      });
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update coupon";
      setNotification({ message, type: "error" });
      setLoading(false);
      return { success: false, message };
    }
  };

  // Delete coupon (admin)
  const deleteCoupon = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
      setNotification({
        message: "Coupon deleted successfully!",
        type: "success",
      });
      setLoading(false);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete coupon";
      setNotification({ message, type: "error" });
      setLoading(false);
      return { success: false, message };
    }
  };

  // Get claim history (admin)
  const getClaimHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coupons/claims");
      setClaims(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch claim history"
      );
      setLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch claim history",
      };
    }
  };

  // Clear notification
  const clearNotification = () => {
    setNotification({ message: "", type: "" });
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        claims,
        loading,
        error,
        notification,
        getNextCoupon,
        claimCouponAsGuest,
        claimCouponAsUser,
        getCoupons,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        getClaimHistory,
        clearNotification,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};
