const mongoose = require("mongoose");

const CATEGORIES = [
  "Shampoo",
  "Conditioner",
  "Hair Oils",
  "Hair Masks",
  "Hair Creams",
  "Hair Serums",
  "Hair Styling",
  "Hair Accessories",
];

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "English name is required"], trim: true },
    nameAr: { type: String, required: [true, "Arabic name is required"], trim: true },
    description: { type: String, required: [true, "English description is required"] },
    descriptionAr: { type: String, required: [true, "Arabic description is required"] },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
    },
    // Image URL for now; schema is compatible with Cloudinary (secure_url) later
    image: { type: String, required: [true, "Product image URL is required"] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

ProductSchema.index({ name: "text", nameAr: "text", description: "text" });

ProductSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model("Product", ProductSchema);
