require('dotenv').config();
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary");
const _ = require("lodash");



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});


const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: function (req, file, cb) {
    cb(undefined, `elements/${req.user._id}`);
  },
  allowedFormats: ["jpg", "png"],
  filename: function (req, file, cb) {
    cb(undefined, `${_.random(0, 1000)}${file.originalname}`);
  },
});

const uploadCloudinaryImage = multer({ storage });
const removeCloudinaryImage = ({ public_id }) => {
  cloudinary.v2.uploader.destroy(public_id, (error, result) => {
    if (error) throw new Error(error)
  })
};


module.exports = {
  uploadCloudinaryImage,
  removeCloudinaryImage
}
