const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Element = require("../models/Element");
const User = require("../models/User");
const Folder = require("../models/Folder");

const authErrorMsg = { message: "Unauthorized" };


// ELEMENTS 

//upload text
router.post("/upload/text", async (req, res, next) => {
  if (req.user) {
    const { text, folder } = req.body;
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
    res.status(401).json(authErrorMsg)
  }

})


//>>>>>>> FOLDERS

//RETRIEVE FOLDERS FROM USER
router.get("/folders", async (req, res, next) => {
  if (req.user) {
    const { folders } = await User.findOne({ _id: req.user._id }).populate("folders");
    res.status(200).json(folders)
  } else {
    res.status(401).json(authErrorMsg)
  }
});


//TO DO
router.post("/update/layout", async (req, res, next) => {
  if (req.user) {
    const { layout } = req.body;
    try {
      const user = await User.findById(req.user._id);
      user.updateOne({ layout });
      user.save();
      res.status(200).json({ message: `${user.username} dashboard layout updated` });
    }
    catch {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401).json(authErrorMsg)

  }

})

// TO DO
router.post("/update/folder/:folder", async (req, res, next) => {
  const { folder } = req.params;
  const { layout } = req.body;
  try {
    const FolderToUpdate = await Folder.findOne({
      folder,
      user: req.user._id,
    });
    FolderToUpdate.updateOne({ folder, layout });
    FolderToUpdate.save();
    res.status(200).json({ message: `${folder} folder updated` });
  }
  catch {
    res.status(500).json({ message: "Something went wrong" })
  }

})

//CREATE FOLDER
router.post("/create/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    try {
      await Folder.create({
        folder, user: req.user._id, path: `/${req.user.username}/${folder.replace(/ /g, "_")}`
      }, async (err, res) => User.updateOne({ _id: req.user._id }, { $push: { folders: res._id } }))
      res.status(200).json({ message: `${folder} folder created` });
    }
    catch {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401).json(authErrorMsg)
  }

})


// DELETE FOLDER FROM DB and update user  ?? delete also elements? delete bulk in Element collection
router.delete("/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    try {
      await Folder.findOneAndDelete({
        $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }]
      }, async (err, res) => { await User.updateOne({ _id: req.user._id }, { $pull: { folders: res._id } })
      await Element.deleteMany({ $and: [{ user: req.user._id }, { folder: res._id }] })
    });
      res.status(200).json({ message: `${folder} folder deleted` });
    }
    catch (err) {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401).json(authErrorMsg)
  }
})



//RETRIEVE CONTENT OF FOLDER
// TO DO: ADD PAGINATION
router.get("/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    const { elements } = await Folder.findOne({
      $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }]
    }).populate("elements");
    res.status(200).json(elements)
  } else {
    res.status(401).json({ message: "You must be logged in" })
  }
})




module.exports = router;