const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

// @desc    Upload a product image file, get back a hosted URL
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = async (req, res, next) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message:
          "Image upload isn't configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the backend's environment variables (see README section 9), or paste an image URL instead.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file was provided" });
    }

    // Upload the in-memory buffer to Cloudinary via an upload stream.
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "veloura/products", resource_type: "image" },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
