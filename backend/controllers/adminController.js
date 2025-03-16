const Admin = require("../models/Admin");
const Coupon = require("../models/Coupon");
const Claim = require("../models/Claim");
const generateToken = require("../utils/generateToken");

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (admin) {
      res.json(admin);
    } else {
      res.status(404);
      throw new Error("Admin not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a new coupon
// @route   POST /api/admin/coupons
// @access  Private
const createCoupon = async (req, res) => {
  try {
    const { code, description, expiryDate, value, isPercentage } = req.body;

    // Check if coupon with the same code exists
    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
      res.status(400);
      throw new Error("Coupon with this code already exists");
    }

    // Get the highest distribution order
    const lastCoupon = await Coupon.findOne().sort({ distributionOrder: -1 });
    const distributionOrder = lastCoupon ? lastCoupon.distributionOrder + 1 : 1;

    const coupon = await Coupon.create({
      code,
      description,
      expiryDate,
      value,
      isPercentage,
      distributionOrder,
    });

    if (coupon) {
      res.status(201).json(coupon);
    } else {
      res.status(400);
      throw new Error("Invalid coupon data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ distributionOrder: 1 });
    res.json(coupons);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get coupon by ID
// @route   GET /api/admin/coupons/:id
// @access  Private
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404);
      throw new Error("Coupon not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private
const updateCoupon = async (req, res) => {
  try {
    const { code, description, expiryDate, value, isPercentage, isActive } =
      req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.code = code || coupon.code;
      coupon.description = description || coupon.description;
      coupon.expiryDate = expiryDate || coupon.expiryDate;
      coupon.value = value || coupon.value;
      coupon.isPercentage =
        isPercentage !== undefined ? isPercentage : coupon.isPercentage;
      coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404);
      throw new Error("Coupon not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await coupon.remove();
      res.json({ message: "Coupon removed" });
    } else {
      res.status(404);
      throw new Error("Coupon not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all coupon claims
// @route   GET /api/admin/claims
// @access  Private
const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find({})
      .populate("coupon")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create initial admin user
// @route   POST /api/admin/createAdmin
// @access  Public (should be disabled after first use)
const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      res.status(400);
      throw new Error("Admin already exists");
    }

    const admin = await Admin.create({
      username,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid admin data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getClaims,
  createAdmin,
};
