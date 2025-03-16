import { useState, useEffect, useContext } from "react";
import { CouponContext } from "../context/CouponContext";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";
import Notification from "./Notification";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("coupons");
  const [claims, setClaims] = useState([]);
  const [showAddCouponForm, setShowAddCouponForm] = useState(false);
  const [editCouponData, setEditCouponData] = useState(null);

  const {
    getCoupons,
    coupons,
    loading,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getClaimHistory,
    notification,
    clearNotification,
  } = useContext(CouponContext);

  useEffect(() => {
    getCoupons();
  }, []);

  useEffect(() => {
    if (activeSection === "claims") {
      fetchClaimHistory();
    }
  }, [activeSection]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  const fetchClaimHistory = async () => {
    const result = await getClaimHistory();
    if (result.success) {
      setClaims(result.data);
    }
  };

  const handleAddCoupon = async (couponData) => {
    const result = await createCoupon(couponData);
    if (result.success) {
      setShowAddCouponForm(false);
    }
  };

  const handleUpdateCoupon = async (couponData) => {
    const result = await updateCoupon(editCouponData._id, couponData);
    if (result.success) {
      setEditCouponData(null);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      await deleteCoupon(id);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditCouponData(coupon);
    setShowAddCouponForm(false);
  };

  return (
    <div className="admin-dashboard">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>

        <div className="dashboard-nav">
          <button
            className={`nav-btn ${activeSection === "coupons" ? "active" : ""}`}
            onClick={() => setActiveSection("coupons")}
          >
            Manage Coupons
          </button>
          <button
            className={`nav-btn ${activeSection === "claims" ? "active" : ""}`}
            onClick={() => setActiveSection("claims")}
          >
            Claim History
          </button>
        </div>
      </div>

      {activeSection === "coupons" && (
        <div className="coupons-section">
          <div className="section-header">
            <h2>Coupon Management</h2>

            {!showAddCouponForm && !editCouponData && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAddCouponForm(true)}
              >
                Add New Coupon
              </button>
            )}
          </div>

          {showAddCouponForm && (
            <div className="form-container">
              <h3>Add New Coupon</h3>
              <CouponForm
                onSubmit={handleAddCoupon}
                onCancel={() => setShowAddCouponForm(false)}
              />
            </div>
          )}

          {editCouponData && (
            <div className="form-container">
              <h3>Edit Coupon</h3>
              <CouponForm
                couponData={editCouponData}
                onSubmit={handleUpdateCoupon}
                onCancel={() => setEditCouponData(null)}
              />
            </div>
          )}

          {!showAddCouponForm && !editCouponData && (
            <CouponList
              coupons={coupons}
              loading={loading}
              onEdit={handleEditCoupon}
              onDelete={handleDeleteCoupon}
            />
          )}
        </div>
      )}

      {activeSection === "claims" && (
        <div className="claims-section">
          <div className="section-header">
            <h2>Claim History</h2>
          </div>

          {loading ? (
            <div className="loading">Loading claim history...</div>
          ) : (
            <div className="claims-list">
              {claims.length === 0 ? (
                <p>No claims found.</p>
              ) : (
                <table className="claims-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Coupon</th>
                      <th>Claimed On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim._id}>
                        <td>{claim.user.name}</td>
                        <td>{claim.coupon.code}</td>
                        <td>
                          {new Date(claim.claimedAt).toLocaleDateString()}
                        </td>
                        <td className={`status ${claim.status.toLowerCase()}`}>
                          {claim.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
