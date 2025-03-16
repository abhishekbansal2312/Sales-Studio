const rateLimit = require("express-rate-limit");

// Create a rate limiter for IP-based limiting
const ipLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // limit each IP to 3 requests per windowMs
  message:
    "Too many coupon claims from this IP, please try again after 24 hours",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => req.ip, // Use IP address as the key
});

module.exports = { ipLimiter };
