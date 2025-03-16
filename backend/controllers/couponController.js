const Coupon = require("../models/Coupon");
const Claim = require("../models/Claim");
const crypto = require("crypto");

// @desc    Get next available coupon in round-robin fashion
// @route   GET /api/coupons/next
// @access  Public
const getNextAvailableCoupon = async (req, res) => {
  try {
    // Generate or get session ID from cookies
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = crypto.randomBytes(16).toString("hex");
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
      });
    }

    // Get client IP address
    const ipAddress = req.ip;

    // Check if this IP or session has claimed in the last 24 hours
    const lastClaim = await Claim.findOne({
      $or: [{ ipAddress: ipAddress }, { sessionId: sessionId }],
      claimedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (lastClaim) {
      return res.status(429).json({
        message:
          "You have already claimed a coupon in the last 24 hours. Please try again later.",
        nextAvailableTime: new Date(
          lastClaim.claimedAt.getTime() + 24 * 60 * 60 * 1000
        ),
      });
    }

    // Find next available coupon based on round-robin (smallest distribution order that's not claimed)
    const availableCoupon = await Coupon.findOne({
      isClaimed: false,
      isActive: true,
      expiryDate: { $gt: new Date() },
    }).sort({ distributionOrder: 1 });

    if (!availableCoupon) {
      return res
        .status(404)
        .json({ message: "No coupons available at the moment" });
    }

    res.json({
      coupon: {
        code: availableCoupon.code,
        description: availableCoupon.description,
        value: availableCoupon.value,
        isPercentage: availableCoupon.isPercentage,
        expiryDate: availableCoupon.expiryDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Claim a coupon
// @route   POST /api/coupons/claim/:id
// @access  Public
const claimCoupon = async (req, res) => {
  try {
    // Generate or get session ID from cookies
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = crypto.randomBytes(16).toString("hex");
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
      });
    }

    // Get client IP address and user agent
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    // Check if this IP or session has claimed in the last 24 hours
    const lastClaim = await Claim.findOne({
      $or: [{ ipAddress: ipAddress }, { sessionId: sessionId }],
      claimedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (lastClaim) {
      return res.status(429).json({
        message:
          "You have already claimed a coupon in the last 24 hours. Please try again later.",
        nextAvailableTime: new Date(
          lastClaim.claimedAt.getTime() + 24 * 60 * 60 * 1000
        ),
      });
    }

    // Get the coupon from code
    const { code } = req.params;
    const coupon = await Coupon.findOne({
      code,
      isClaimed: false,
      isActive: true,
      expiryDate: { $gt: new Date() },
    });

    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Coupon not available or has already been claimed" });
    }

    // Mark coupon as claimed
    coupon.isClaimed = true;
    await coupon.save();

    // Create claim record
    const claim = await Claim.create({
      coupon: coupon._id,
      ipAddress,
      sessionId,
      userAgent,
    });

    res.status(201).json({
      message: "Coupon claimed successfully!",
      coupon: {
        code: coupon.code,
        description: coupon.description,
        value: coupon.value,
        isPercentage: coupon.isPercentage,
        expiryDate: coupon.expiryDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      isClaimed: false,
      expiryDate: { $gt: new Date() },
    })
      .select("-code")
      .sort({ distributionOrder: 1 });

    res.json({
      count: coupons.length,
      coupons: coupons.map((coupon) => ({
        description: coupon.description,
        value: coupon.value,
        isPercentage: coupon.isPercentage,
        expiryDate: coupon.expiryDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNextAvailableCoupon,
  claimCoupon,
  getAvailableCoupons,
};
