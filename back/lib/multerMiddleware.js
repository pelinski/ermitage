const multer = require("multer");
const path = require("path");
// Store files locally on uploads directory
const upload = multer({ dest: "uploads/" });

// Store files in cloudinary CDN service
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const uploadCloud = multer({
  storage: cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "lab-profile-app", // The name of the folder in cloudinary
    allowedFormats: ["jpg", "png"]
  })
});

module.exports = {
  upload,
  uploadCloud
};
