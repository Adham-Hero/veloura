const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// In production, restrict CORS to your deployed frontend domain(s) only.
// Add FRONTEND_URL to your environment variables, e.g.
// FRONTEND_URL=https://veloura.vercel.app
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, "http://localhost:5173"]
  : true; // fallback: allow all origins (useful for local dev only)

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure a DB connection exists before handling any request.
// connectDB() is cached, so on serverless platforms (Vercel) this is a
// near-instant no-op after the first cold start, and on a normal Node
// server (Render/local) it only ever really connects once.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Veloura API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
