const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches the user to req.user.
// This is the ONLY source of truth for who the user is - never trust client-sent roles.
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user; // full user doc (role comes from DB, not from the token payload)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

// Must be used AFTER protect. Blocks anyone whose DB role isn't admin.
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admin privileges required." });
};

module.exports = { protect, admin };
