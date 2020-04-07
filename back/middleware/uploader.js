import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import _ from "lodash";

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "avatar",
  allowedFormats: ["jpg", "png"],
  filename: function (req, file, cb) {
    const userID = _.get(req, "user._id");
    const userFile = userID ? `avatar${userID}` : file;
    cb(undefined, userFile);
  },
});

const uploadCloudinaryAvatar = multer({ storage });
const upload = multer({ dest: "uploads/" });

module.exports = {
  uploadCloudinaryAvatar,
  upload
}
