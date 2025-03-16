const express = require("express");
const {
  getNextCoupon,
  claimCoupon,
  getCoupons,
  createCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getClaimHistory,
} = require("../controllers/couponController");
const { protect, admin } = require("../middlewares/authMiddleware");
const { rateLimiter } = require("../middlewares/rateLimit");

const router = express.Router();

// Public routes
router.get("/next", rateLimiter, getNextCoupon);
router.post("/claim/:id", rateLimiter, protect, claimCoupon);

// Guest claim route (no authentication required)
router.post("/guest-claim/:id", rateLimiter, claimCoupon);

// Admin routes
router
  .route("/")
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.get("/claims", protect, admin, getClaimHistory);

router
  .route("/:id")
  .get(protect, admin, getCouponById)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

module.exports = router;
