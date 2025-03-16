import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ClaimCoupon from "../components/ClaimCoupon";
import CouponCard from "../components/CouponCard";
import Notification from "../components/Notification";
import { useCouponContext } from "../context/CouponContext";
import api from "../api/api";

const Home = () => {
  const { loading, error, message, nextCoupon, dispatch } = useCouponContext();
  const [availableCouponsCount, setAvailableCouponsCount] = useState(0);

  useEffect(() => {
    const fetchNextCoupon = async () => {
      try {
        dispatch({ type: "REQUEST_START" });
        const { data } = await api.get("/coupons/next");
        dispatch({
          type: "GET_NEXT_COUPON_SUCCESS",
          payload: data.coupon,
        });
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Rate limit reached
          dispatch({
            type: "REQUEST_FAIL",
            payload: `You've already claimed a coupon. Please try again later.`,
          });
        } else if (error.response && error.response.status === 404) {
          // No coupons available
          dispatch({
            type: "REQUEST_FAIL",
            payload: "No coupons available at the moment.",
          });
        } else {
          dispatch({
            type: "REQUEST_FAIL",
            payload: error.response?.data?.message || "Error fetching coupon.",
          });
        }
      }
    };

    const fetchAvailableCouponsCount = async () => {
      try {
        const { data } = await api.get("/coupons");
        setAvailableCouponsCount(data.count);
      } catch (error) {
        console.error("Error fetching available coupons count:", error);
      }
    };

    fetchNextCoupon();
    fetchAvailableCouponsCount();
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      // Clear message after showing toast
      setTimeout(() => {
        dispatch({ type: "CLEAR_MESSAGE" });
      }, 5000);
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      // Clear error after showing toast
      setTimeout(() => {
        dispatch({ type: "CLEAR_ERROR" });
      }, 5000);
    }
  }, [error, dispatch]);

  const handleClaimCoupon = async () => {
    if (!nextCoupon) return;

    try {
      dispatch({ type: "REQUEST_START" });
      const { data } = await api.post(`/coupons/claim/${nextCoupon.code}`);
      dispatch({
        type: "COUPON_CLAIM_SUCCESS",
        payload: {
          message: data.message,
          coupon: data.coupon,
        },
      });

      // Update available coupons count
      const { data: couponsData } = await api.get("/coupons");
      setAvailableCouponsCount(couponsData.count);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        dispatch({
          type: "REQUEST_FAIL",
          payload: "You have already claimed a coupon. Please try again later.",
        });
      } else {
        dispatch({
          type: "REQUEST_FAIL",
          payload: error.response?.data?.message || "Error claiming coupon.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            Coupon Distribution App
          </h1>
          <p className="text-lg text-gray-600">
            Claim your exclusive coupon below!
          </p>
          <p className="text-md text-gray-500 mt-2">
            {availableCouponsCount > 0
              ? `${availableCouponsCount} coupons available`
              : "No coupons available at the moment"}
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {nextCoupon ? (
              <div className="flex flex-col items-center">
                <CouponCard
                  coupon={nextCoupon}
                  showCode={false}
                  className="w-full max-w-md"
                />
                <div className="mt-6">
                  <ClaimCoupon onClaim={handleClaimCoupon} />
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-700">
                  {error || "No coupons available at the moment."}
                </p>
              </div>
            )}
          </>
        )}

        <Notification />

        <div className="mt-12 text-center">
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Admin Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
