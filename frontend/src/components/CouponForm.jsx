import React, { useState } from "react";
import axios from "../api/api"; // Adjust the path to your API configuration file
import { useCouponContext } from "../context/CouponContext";

export default function CouponForm() {
  const { dispatch } = useCouponContext();
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    expiryDate: "",
    value: "",
    isPercentage: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await axios.post("/admin/coupons", formData);
      setMessage("Coupon added successfully!");
      dispatch({ type: "ADD_COUPON_SUCCESS", payload: data });

      // Reset form after submission
      setFormData({
        code: "",
        description: "",
        expiryDate: "",
        value: "",
        isPercentage: true,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Coupon</h2>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      {error && <p className="mb-4 text-red-400">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-600 rounded bg-gray-700"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-600 rounded bg-gray-700"
        />
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-600 rounded bg-gray-700"
        />
        <input
          type="number"
          name="value"
          placeholder="Value"
          value={formData.value}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-600 rounded bg-gray-700"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPercentage"
            checked={formData.isPercentage}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Percentage Discount</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {loading ? "Adding..." : "Add Coupon"}
        </button>
      </form>
    </div>
  );
}
