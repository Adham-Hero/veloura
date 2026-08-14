const multer = require("multer");

// Store the file in memory (as a Buffer) rather than on disk - we forward it
// straight to Cloudinary and never need to persist it locally. This also
// makes it safe to run on serverless platforms (Vercel) with a read-only/
// ephemeral filesystem.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, or GIF image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
