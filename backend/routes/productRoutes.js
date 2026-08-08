const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getRelatedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/categories/list", getCategories);
router.get("/", getProducts);
router.post("/", protect, admin, createProduct);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
