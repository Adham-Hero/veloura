const Product = require("../models/Product");

// @desc    Get all products (supports search, category filter, sorting, pagination)
// @route   GET /api/products
// @access  Public
// Query params:
//   keyword   - text search on name/nameAr/description
//   category  - filter by category
//   sort      - "price_asc" | "price_desc" | "newest" | "rating"
//   page      - page number (default 1)
//   limit     - items per page (default 12)
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, sort, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { nameAr: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    let sortOption = { createdAt: -1 }; // newest first by default
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products (same category, excluding current)
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);
    res.json(related);
  } catch (error) {
    next(error);
  }
};

// @desc    Get available categories
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    res.json(Product.CATEGORIES);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      oldPrice,
      category,
      image,
      stock,
      rating,
      isFeatured,
      isBestSeller,
    } = req.body;

    if (!name || !nameAr || !description || !descriptionAr || price === undefined || !category || !image) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    const product = await Product.create({
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      oldPrice: oldPrice || null,
      category,
      image,
      stock: stock ?? 0,
      rating: rating ?? 0,
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatableFields = [
      "name",
      "nameAr",
      "description",
      "descriptionAr",
      "price",
      "oldPrice",
      "category",
      "image",
      "stock",
      "rating",
      "isFeatured",
      "isBestSeller",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getRelatedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
