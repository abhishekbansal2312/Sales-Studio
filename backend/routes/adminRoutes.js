const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getClaims,
  createAdmin,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.post("/login", loginAdmin);
router.post("/createAdmin", createAdmin); // Should be disabled after first use

// Protected routes
router.get("/profile", protect, getAdminProfile);
router.post("/coupons", protect, createCoupon);
router.get("/coupons", protect, getCoupons);
router.get("/coupons/:id", protect, getCouponById);
router.put("/coupons/:id", protect, updateCoupon);
router.delete("/coupons/:id", protect, deleteCoupon);
router.get("/claims", protect, getClaims);

module.exports = router;
