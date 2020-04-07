const express = require('express');
const router = express.Router();
const { upload, uploadCloudinaryAvatar } = require("../middleware/uploader");

/* GET home page */
router.get('/', (req, res, next) => {
  res.json({ message: "Welcome to the ermitage API" });
});

router.post(
  "/profilepic",
  uploadCloudinaryAvatar.single("avatar"),
  async (req, res) => {
    console.log(req.file);
    const user = req.user;

    // if there was previous profile pic, delete it

    // Set the new profile pic
    user.profilePic = req.file;
    const updatedUser = await user.save();

    return res.json({ status: "Uploaded completed", user: updatedUser });
  }
);

module.exports = router;
