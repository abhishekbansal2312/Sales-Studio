import React from "react";

const ClaimCoupon = ({ onClaim }) => {
  return (
    <button
      onClick={onClaim}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105"
    >
      Claim My Coupon
    </button>
  );
};

export default ClaimCoupon;
