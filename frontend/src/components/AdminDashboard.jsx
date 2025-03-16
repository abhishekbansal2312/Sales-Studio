import React from "react";

const AdminDashboard = ({ coupons, claims }) => {
  // Calculate stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((coupon) => coupon.isActive).length;
  const claimedCoupons = coupons.filter((coupon) => coupon.isClaimed).length;
  const expiredCoupons = coupons.filter(
    (coupon) => new Date(coupon.expiryDate) < new Date()
  ).length;

  // Get recent claims (last 5)
  const recentClaims = claims.slice(0, 5);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Coupons</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Active Coupons
          </h3>
          <p className="text-3xl font-bold text-green-600">{activeCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Claimed Coupons
          </h3>
          <p className="text-3xl font-bold text-blue-600">{claimedCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Expired Coupons
          </h3>
          <p className="text-3xl font-bold text-red-600">{expiredCoupons}</p>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Claims</h2>

        {recentClaims.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Coupon Code
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Claimed At
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {claim.coupon.code}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {formatDate(claim.claimedAt)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {claim.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No claims yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
