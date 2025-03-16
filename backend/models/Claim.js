const mongoose = require("mongoose");

const claimSchema = mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Coupon",
    },
    ipAddress: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
