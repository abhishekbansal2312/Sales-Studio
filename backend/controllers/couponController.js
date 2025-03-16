const Coupon = require("../models/Coupon");
const Claim = require("../models/Claim");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Get next available coupon
// @route   GET /api/coupons/next
// @access  Public
const getNextCoupon = asyncHandler(async (req, res) => {
  // Get IP and session ID
  const ipAddress = req.ip;
  const browserSession = req.headers["user-agent"] || "unknown";

  // Check for cooldown period for this IP/session
  const cooldownPeriod = 60 * 60 * 1000; // 1 hour in milliseconds
  const recentClaim = await Claim.findOne({
    ipAddress,
    browserSession,
    claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) },
  });

  if (recentClaim) {
    const timeLeft =
      new Date(recentClaim.claimedAt.getTime() + cooldownPeriod) - new Date();
    const minutesLeft = Math.ceil(timeLeft / (60 * 1000));

    return res.status(429).json({
      message: `You've already claimed a coupon recently. Please try again in ${minutesLeft} minutes.`,
    });
  }

  // Find the next available coupon
  const availableCoupon = await Coupon.findOne({
    isActive: true,
    isClaimed: false,
  }).sort({ createdAt: 1 });

  if (!availableCoupon) {
    return res
      .status(404)
      .json({ message: "No coupons available at this time." });
  }

  // Return coupon without claiming it yet
  res.json({
    coupon: {
      _id: availableCoupon._id,
      code: availableCoupon.code,
      discount: availableCoupon.discount,
      description: availableCoupon.description,
      expiryDate: availableCoupon.expiryDate,
    },
  });
});

// @desc    Claim a coupon
// @route   POST /api/coupons/claim/:id
// @access  Public
const claimCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params.id;
  const ipAddress = req.ip;
  const browserSession = req.headers["user-agent"] || "unknown";

  // Find coupon
  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  if (!coupon.isActive) {
    res.status(400);
    throw new Error("This coupon is currently inactive");
  }

  if (coupon.isClaimed) {
    res.status(400);
    throw new Error("This coupon has already been claimed");
  }

  // Check for cooldown period (double check even though we checked in getNextCoupon)
  const cooldownPeriod = 60 * 60 * 1000; // 1 hour in milliseconds
  const recentClaim = await Claim.findOne({
    ipAddress,
    browserSession,
    claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) },
  });

  if (recentClaim) {
    const timeLeft =
      new Date(recentClaim.claimedAt.getTime() + cooldownPeriod) - new Date();
    const minutesLeft = Math.ceil(timeLeft / (60 * 1000));

    return res.status(429).json({
      message: `You've already claimed a coupon recently. Please try again in ${minutesLeft} minutes.`,
    });
  }

  // Create claim record
  const claimData = {
    coupon: coupon._id,
    ipAddress,
    browserSession,
    isGuestClaim: !req.user,
  };

  // If user is logged in, associate claim with user
  if (req.user) {
    claimData.user = req.user._id;
    claimData.isGuestClaim = false;

    // Add coupon to user's claimed coupons
    await User.findByIdAndUpdate(req.user._id, {
      $push: { claimedCoupons: coupon._id },
    });
  }

  const claim = await Claim.create(claimData);

  // Mark coupon as claimed
  coupon.isClaimed = true;
  coupon.claimedAt = Date.now();
  coupon.claimedBy = claim._id;
  await coupon.save();

  res.status(201).json({
    message: "Coupon claimed successfully!",
    coupon: {
      code: coupon.code,
      discount: coupon.discount,
      description: coupon.description,
      expiryDate: coupon.expiryDate,
    },
  });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, description, expiryDate } = req.body;

  const couponExists = await Coupon.findOne({ code });

  if (couponExists) {
    res.status(400);
    throw new Error("Coupon with this code already exists");
  }

  const coupon = await Coupon.create({
    code,
    discount,
    description,
    expiryDate: expiryDate || null,
    isActive: true,
    isClaimed: false,
  });

  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(400);
    throw new Error("Invalid coupon data");
  }
});

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Admin
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error("Coupon not found");
  }
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount, description, expiryDate, isActive } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    // Only allow updating certain fields if coupon is not claimed
    if (!coupon.isClaimed) {
      coupon.code = code || coupon.code;
      coupon.discount = discount || coupon.discount;
      coupon.description = description || coupon.description;
      coupon.expiryDate = expiryDate || coupon.expiryDate;
    }

    // Allow toggling active status even if claimed
    if (isActive !== undefined) {
      coupon.isActive = isActive;
    }

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } else {
    res.status(404);
    throw new Error("Coupon not found");
  }
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    if (coupon.isClaimed) {
      res.status(400);
      throw new Error("Cannot delete a claimed coupon");
    }

    await coupon.deleteOne();
    res.json({ message: "Coupon removed" });
  } else {
    res.status(404);
    throw new Error("Coupon not found");
  }
});

// @desc    Get claim history
// @route   GET /api/coupons/claims
// @access  Admin
const getClaimHistory = asyncHandler(async (req, res) => {
  const claims = await Claim.find({})
    .populate("coupon")
    .populate("user", "name email")
    .sort({ claimedAt: -1 });

  res.json(claims);
});

module.exports = {
  getNextCoupon,
  claimCoupon,
  getCoupons,
  createCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getClaimHistory,
};
