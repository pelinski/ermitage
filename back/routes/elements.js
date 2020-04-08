const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Element = require("../models/Element");
const User = require("../models/User");
const Folder = require("../models/Folder");

const { uploadCloudinaryImage } = require("../middleware/uploader")


// ELEMENTS 
//GET CONTENT OF FOLDER
// TO DO: ADD PAGINATION
router.get("/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    const { elements } = await Folder.findOne({
      $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }]
    }).populate("elements");
    res.status(200).json(elements)
  } else {
    res.status(401)
  }
})

//UPLOAD TEXT
router.post("/upload/:folder/text", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    const { text } = req.body;
    if (typeof text == 'string') {
      const folderForElement = await Folder.findOne({ $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }] });
      await Element.create({
        type: "text",
        text: text,
        folder: folderForElement._id,
        user: req.user._id
      }, async (err, res) => await Folder.updateOne({ _id: folderForElement._id }, { $push: { elements: res._id } }))
      res.status(200).json({ message: "Element created" })
    } else if (typeof text != "string") {
      res.status(500).json({ message: "This route is for text" });
    }
  } else {
    res.status(401)
  }

})

// UPLOAD IMAGE
router.post("/upload/:folder/image", uploadCloudinaryImage.single("image"), async (req, res) => {
  if (req.user) {
    const { folder } = req.params;
    const folderForElement = await Folder.findOne({ $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }] });
    await Element.create({
      type: "image",
      image: req.file,
      text: "",
      folder: folderForElement._id,
      user: req.user._id
    }, async (err, res) => await Folder.updateOne({ _id: folderForElement._id }, { $push: { elements: res._id } }))

    return res.status(200).json({ message: "Uploaded completed" });
  } else {
    req.status(401)
  }
});

// REMOVE ELEMENT FROM DB
router.delete("/:id", async (req, res, next) => {
  if (req.user) {
    const { id } = req.params;
    console.log(id)
    try {
      await Element.findOneAndDelete({
        $and: [{ user: req.user._id }, { _id: id }]
      }, async (err, res) => {
        await Folder.updateOne({
          $and: [{ user: req.user._id }, { _id: res.folder }]
        }, { $pull: { elements: res._id } });
      });
      res.status(200).json({ message: `Element deleted` });
    }
    catch (err) {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401)
  }
})



module.exports = router;