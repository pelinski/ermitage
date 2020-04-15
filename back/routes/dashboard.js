const express = require("express");
const router = express.Router();

const Element = require("../models/Element");
const User = require("../models/User");
const Folder = require("../models/Folder");

const { removeCloudinaryFolder } = require("../middleware/cloudinary")


//RETRIEVE FOLDERS FROM USER
router.get("/folders", async (req, res, next) => {
  if (req.user) {
    const { folders } = await User.findOne({ _id: req.user._id }).populate("folders");
    res.status(200).json(folders)
  } else {
    res.status(401)
  }
});


//UPDATE DASHBOARD LAYOUT TO USER DOCUMENT
router.post("/update/layout", async (req, res, next) => {
  if (req.user) {
    const { layout } = req.body;
    try {
      const user = await User.updateOne({ _id: req.user._id }, { layout });
      res.status(200).json({ message: `${user.username} dashboard layout updated` });
    }
    catch {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401)

  }

})


//GET DASHBOARD LAYOUT
router.get("/layout", async (req, res, next) => {
  if (req.user) {
    try {
      const { layout } = await User.findOne({ _id: req.user._id });
      res.status(200).json(layout);
    }
    catch {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401)
  }
})


/*
// TO DO. route to update folder name
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

})*/

//CREATE FOLDER
router.post("/create/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    try {

      // No duplicated folder names
      const existingFolder = await Folder.findOne({ $and: [{ user: req.user._id }, { folder }] })
      if (existingFolder !== null) {
        return res.status(406).json({ message: "Sorry, this folder name already exists" });
      }
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

// CHANGE FOLDER PRIVACY 
router.post(`/:folder/privacy`, async (req, res, next) => {
  const { folder } = req.params;
  if (req.user) {
    const { isPrivate } = req.body;
    try {
      await Folder.updateOne({ $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }] }, { isPrivate });
      res.status(200).json({ message: `${folder} privacy updated` });
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
      }, async (err, res) => {
        await User.updateOne({ _id: req.user._id }, { $pull: { folders: res._id } })
        await Element.deleteMany({ $and: [{ user: req.user._id }, { folder: res._id }] });
        //delete also pics from cloudinary
        removeCloudinaryFolder({ id: req.user._id, folder });

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

//UPDATE FOLDER LAYOUT
router.post("/update/:folder/layout", async (req, res, next) => {
  const { folder } = req.params;
  if (req.user) {
    const { layout } = req.body;
    try {
      await Folder.updateOne({ $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }] }, { layout });
      res.status(200).json({ message: `${folder} layout updated` });
    }
    catch {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401)
  }
});

//GET FOLDER LAYOUT
router.get("/:folder/layout", async (req, res, next) => {
  const { folder } = req.params;
  if (req.user) {
    try {
      const { layout } = await Folder.findOne({ $and: [{ user: req.user._id }, { path: `/${req.user.username}/${folder.replace(/ /g, "_")}` }] });
      res.status(200).json(layout);
    }
    catch {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401)
  }
})


module.exports = router;