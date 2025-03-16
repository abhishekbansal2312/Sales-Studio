import { useState, useEffect, useContext } from "react";
import { CouponContext } from "../context/CouponContext";
import { UserContext } from "../context/UserContext";
import Notification from "./Notification";

const ClaimCoupon = () => {
  const [nextCoupon, setNextCoupon] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    getNextCoupon,
    claimCouponAsGuest,
    claimCouponAsUser,
    notification,
    clearNotification,
  } = useContext(CouponContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchNextCoupon();
  }, []);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  const fetchNextCoupon = async () => {
    setLoading(true);
    setMessage("");

    const result = await getNextCoupon();

    if (result.success) {
      setNextCoupon(result.data.coupon);
    } else {
      setMessage(result.message);
      setNextCoupon(null);
    }

    setLoading(false);
  };

  const handleClaimCoupon = async () => {
    if (!nextCoupon) return;

    setLoading(true);

    const result = user
      ? await claimCouponAsUser(nextCoupon._id)
      : await claimCouponAsGuest(nextCoupon._id);

    if (result.success) {
      setNextCoupon(null);
      // Wait a moment before fetching the next available coupon
      setTimeout(fetchNextCoupon, 1000);
    }

    setLoading(false);
  };

  return (
    <div className="claim-coupon-container">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <h2>Claim a Coupon</h2>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : message ? (
        <div className="info-message">{message}</div>
      ) : nextCoupon ? (
        <div className="coupon-preview">
          <div className="coupon-details">
            <h3>{nextCoupon.code}</h3>
            <p className="discount">{nextCoupon.discount}% OFF</p>
            {nextCoupon.description && (
              <p className="description">{nextCoupon.description}</p>
            )}
            {nextCoupon.expiryDate && (
              <p className="expiry">
                Expires: {new Date(nextCoupon.expiryDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <button
            onClick={handleClaimCoupon}
            className="btn btn-primary claim-btn"
            disabled={loading}
          >
            Claim This Coupon
          </button>

          {!user && (
            <div className="guest-notice">
              <p>
                You're claiming as a guest. <a href="/register">Register</a> to
                save your coupons.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="no-coupon">
          <p>No coupons available right now.</p>
          <button onClick={fetchNextCoupon} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimCoupon;
