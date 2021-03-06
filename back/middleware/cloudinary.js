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


const imageStorage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: function (req, file, cb) {
    cb(undefined, `elements/${req.user._id}/${req.params.folder}`);
  },
  allowedFormats: ["jpg", "png", "gif"],
  filename: function (req, file, cb) {
    cb(undefined, `${_.random(0, 1000)}${file.originalname}`);
  },
});

const audioStorage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: function (req, file, cb) {
    cb(undefined, `elements/${req.user._id}/${req.params.folder}`);
  },
  params: { resource_type: 'video' },
  allowedFormats: ["m4a", "mp3", "wav"],
  filename: function (req, file, cb) {
    cb(undefined, `${_.random(0, 1000)}${file.originalname}`);
  },
});

const profilePicStorage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: function (req, file, cb) {
    cb(undefined, `profile`);
  },
  params: {
    invalidate: true    //rewritten pic gets not cached
  },
  allowedFormats: ["jpg", "png", "jpeg"],
  filename: function (req, file, cb) {
    cb(undefined, `${req.user._id}`); //autodeletes old profile pic 
  },
});

const uploadCloudinaryImage = multer({ storage: imageStorage });
const uploadCloudinaryAudio = multer({ storage: audioStorage });
const uploadCloudinaryProfilePic = multer({ storage: profilePicStorage });


const removeCloudinaryFile = ({ public_id }) => {
  cloudinary.v2.uploader.destroy(public_id, (error, result) => {
    if (error) { console.log(error) }
  })
};

const removeCloudinaryFolder = ({ id, folder }) => {
  cloudinary.api.delete_resources_by_prefix(`elements/${id}/${folder}/`);
}

module.exports = {
  uploadCloudinaryImage,
  uploadCloudinaryAudio,
  uploadCloudinaryProfilePic,
  removeCloudinaryFile,
  removeCloudinaryFolder
}
