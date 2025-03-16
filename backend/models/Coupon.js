const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    isPercentage: {
      type: Boolean,
      default: true,
    },
    isClaimed: {
      type: Boolean,
      default: false,
    },
    // Track order for round-robin distribution
    distributionOrder: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
