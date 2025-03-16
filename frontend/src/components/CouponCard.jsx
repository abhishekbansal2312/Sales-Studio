import React from "react";

const CouponCard = ({ coupon, showCode = true, className = "" }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="bg-indigo-600 text-white p-4 text-center">
        <h3 className="text-xl font-bold">
          {coupon.isPercentage
            ? `${coupon.value}% OFF`
            : `$${coupon.value.toFixed(2)} OFF`}
        </h3>
      </div>
      <div className="p-4 border-b border-dashed border-gray-300">
        <p className="text-gray-600 mb-2">{coupon.description}</p>
        <p className="text-sm text-gray-500">
          Expires: {formatDate(coupon.expiryDate)}
        </p>
      </div>
      {showCode && (
        <div className="p-4 text-center">
          <span className="inline-block bg-gray-100 px-4 py-2 rounded-md font-mono text-lg">
            {coupon.code}
          </span>
        </div>
      )}
    </div>
  );
};

export default CouponCard;
