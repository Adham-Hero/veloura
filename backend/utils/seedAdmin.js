// Run with: npm run seed:admin
// Creates (or updates) a single admin account using values from .env
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const User = require("../models/User");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const name = process.env.SEED_ADMIN_NAME || "Veloura Admin";
    const email = (process.env.SEED_ADMIN_EMAIL || "admin@veloura.com").toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin123!";

    let admin = await User.findOne({ email }).select("+password");

    if (admin) {
      admin.role = "admin";
      admin.name = name;
      admin.password = password; // reset password too, so re-running this script is predictable
      await admin.save();
      console.log(`Existing user promoted to admin and password reset: ${email}`);
    } else {
      admin = await User.create({ name, email, password, role: "admin" });
      console.log(`Admin account created: ${email}`);
    }

    console.log("You can now log in with this account and access the Admin Dashboard.");
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
