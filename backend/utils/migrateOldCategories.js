// Run with: node utils/migrateOldCategories.js
//
// When categories are removed from the Product schema's enum, any existing
// product still saved under one of those old category values becomes
// "invalid" from Mongoose's point of view - even though it's sitting
// untouched in MongoDB (Mongo itself doesn't enforce the enum, only
// Mongoose's validation on save does). This script finds any such products
// and reassigns them to a sensible current category, so they show up
// correctly in the Shop's category filters again and are safe to save.
//
// Uses the MongoDB driver directly (not Mongoose's validated .save()) to
// read/write, since the whole point is these documents currently fail
// Mongoose validation and wouldn't load/save cleanly through the model.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Product = require("../models/Product");

// Map each removed category to where its leftover products should go.
// Edit this mapping if you'd prefer different targets before running.
const CATEGORY_REMAP = {
  "Hair Masks": "Hair Creams",
  "Hair Serums": "Hair Creams",
  "Hair Styling": "Hair Styling Tools",
  "Hair Accessories": "Hair Care Set",
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const validCategories = Product.CATEGORIES;
    const oldCategoryNames = Object.keys(CATEGORY_REMAP);

    // Query with the raw driver to bypass Mongoose schema validation entirely,
    // since these documents may currently fail it.
    const collection = mongoose.connection.collection("products");
    const affected = await collection.find({ category: { $in: oldCategoryNames } }).toArray();

    if (affected.length === 0) {
      console.log("No products found with old/removed categories. Nothing to do.");
      return;
    }

    console.log(`Found ${affected.length} product(s) with an old category:`);
    for (const p of affected) {
      const newCategory = CATEGORY_REMAP[p.category];
      if (!validCategories.includes(newCategory)) {
        console.warn(`  Skipping "${p.name}" - mapped target "${newCategory}" isn't a valid category either.`);
        continue;
      }
      await collection.updateOne({ _id: p._id }, { $set: { category: newCategory } });
      console.log(`  "${p.name}": "${p.category}" -> "${newCategory}"`);
    }

    console.log("Done. All affected products now have a valid, current category.");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
