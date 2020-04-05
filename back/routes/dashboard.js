const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Element = require("../models/Element");
const User = require("../models/User");
const Folder = require("../models/Folder");


//RETRIEVE FOLDERS FROM USER
router.get("/folders", async (req, res, next) => {
  if (req.user) {
    const { folders } = await User.findOne({ _id: req.user._id }).populate("folders");
    res.status(200).json(folders)
  } else {
    res.status(401)
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
    res.status(401)

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
    res.status(401)
  }

})


// DELETE FOLDER and its elements FROM DB
router.delete("/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    try {
      await Folder.findOneAndDelete({
        $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }]
      }, async (err, res) => { await User.updateOne({ _id: req.user._id }, { $pull: { folders: res._id } })
      await Element.deleteMany({ $and: [{ user: req.user._id }, { folder: res._id }] });
    });
      res.status(200).json({ message: `${folder} folder deleted` });
    }
    catch (err) {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401)
  }
})



module.exports = router;