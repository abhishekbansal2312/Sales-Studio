import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import CouponCard from "../components/CouponCard";

const Profile = () => {
  const { getUserProfile } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const result = await getUserProfile();

      if (result.success) {
        setProfile(result.data);
        setError("");
      } else {
        setError(result.message);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [getUserProfile]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      <div className="profile-info">
        <h2>{profile?.name}</h2>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
      </div>

      <div className="claimed-coupons">
        <h3>Your Claimed Coupons</h3>

        {profile?.claimedCoupons?.length === 0 ? (
          <p>You haven't claimed any coupons yet.</p>
        ) : (
          <div className="coupon-grid">
            {profile?.claimedCoupons?.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                isUserCoupon={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
