import React from "react";
import { useCouponContext } from "../context/CouponContext";

const Notification = () => {
  const { message, error } = useCouponContext();

  if (!message && !error) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-opacity duration-300 ${
        message ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <p>{message || error}</p>
    </div>
  );
};

export default Notification;
