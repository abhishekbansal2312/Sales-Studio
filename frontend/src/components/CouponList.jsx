import React from "react";

const CouponList = ({ coupons, onEdit, onDelete, onToggleStatus }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if coupon is expired
  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {coupons.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Code
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Value
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Expiry Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-mono">{coupon.code}</td>
                  <td className="py-3 px-4">{coupon.description}</td>
                  <td className="py-3 px-4">
                    {coupon.isPercentage
                      ? `${coupon.value}%`
                      : `$${coupon.value.toFixed(2)}`}
                  </td>
                  <td
                    className={`py-3 px-4 ${
                      isExpired(coupon.expiryDate) ? "text-red-500" : ""
                    }`}
                  >
                    {formatDate(coupon.expiryDate)}
                    {isExpired(coupon.expiryDate) && " (Expired)"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        coupon.isClaimed
                          ? "bg-yellow-100 text-yellow-800"
                          : coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isClaimed
                        ? "Claimed"
                        : coupon.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(coupon)}
                        className="px-2 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(coupon._id)}
                        className="px-2 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => onToggleStatus(coupon._id)}
                        className={`px-2 py-1 text-xs rounded ${
                          coupon.isActive
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-4 text-gray-500 text-center">No coupons available.</p>
      )}
    </div>
  );
};

export default CouponList;
