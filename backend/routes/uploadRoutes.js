const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, admin, upload.single("image"), uploadImage);

module.exports = router;
