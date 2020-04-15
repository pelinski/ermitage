const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Element = require("../models/Element");
const Folder = require("../models/Folder");

const { uploadCloudinaryImage, uploadCloudinaryAudio, removeCloudinaryFile } = require("../middleware/cloudinary")


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

// EDIT TEXT
router.post("/edit/text", async (req, res, next) => {
  if (req.user) {
    const { id, text } = req.body;
    await Element.updateOne({ _id: id }, { text })
    res.status(200).json({ message: "Element updated" })
  } else {
    res.status(401)
  }

}


)


// UPLOAD IMAGE
// TO DO: would be cool to add a caption but how do I send folder to the cloudinary middleware and keep the caption?
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

    return res.status(200).json({ message: "Upload completed" });
  } else {
    req.status(401)
  }
});


// UPLOAD FILE
router.post("/upload/:folder/audio", uploadCloudinaryAudio.single("audio"), async (req, res) => {
  if (req.user) {
    console.log("in route", req.file)
    const { folder } = req.params;
    const folderForElement = await Folder.findOne({ $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }] });
    await Element.create({
      type: "audio",
      audio: req.file,
      text: "",
      folder: folderForElement._id,
      user: req.user._id
    }, async (err, res) => await Folder.updateOne({ _id: folderForElement._id }, { $push: { elements: res._id } }))

    return res.status(200).json({ message: "Upload completed" });
  } else {
    req.status(401)
  }
});


// IF ELEMENT IS FILE REMOVE FROM CLOUDINARY
// this is a POST instead of a DELETE bc you cannot send a req.body with a DELETE
// you could use req.params but since the public_id of files contains a route with folders you get a 404
router.post("/cloudinary/delete", async (req, res, next) => {
  if (req.user) {
    const { public_id } = req.body;
    removeCloudinaryFile({ public_id });
    res.status(200).json({ message: "Element deleted" });
  } else {
    res.status(401)
  }
})


// REMOVE ELEMENT FROM DB
router.delete("/:id", async (req, res, next) => {
  if (req.user) {
    const { id } = req.params;
    console.log(id)
    try {
      await Element.findOneAndDelete({ $and: [{ user: req.user._id }, { _id: id }] }, async (err, res) => {
        await Folder.updateOne({ $and: [{ user: req.user._id }, { _id: res.folder }] }, { $pull: { elements: res._id } });
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