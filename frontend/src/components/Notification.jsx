import React from "react";

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-opacity duration-300 ${bgColor} text-white flex items-center justify-between`}
    >
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;
