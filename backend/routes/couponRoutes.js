const express = require("express");
const router = express.Router();
const {
  getNextAvailableCoupon,
  claimCoupon,
  getAvailableCoupons,
} = require("../controllers/couponController");
const { ipLimiter } = require("../middlewares/rateLimit");

// Apply rate limiter to coupon claim routes
router.post("/claim/:code", ipLimiter, claimCoupon);
router.get("/next", getNextAvailableCoupon);
router.get("/", getAvailableCoupons);

module.exports = router;
