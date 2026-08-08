const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Guests can place orders, so createOrder is public.
// If a valid token IS provided, we still want req.user set, so we use protect only
// when the client sends a token; otherwise allow through as guest.
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  next();
};

router.post("/", optionalAuth, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;
