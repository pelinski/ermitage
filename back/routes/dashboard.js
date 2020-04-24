const express = require("express");
const router = express.Router();

const Element = require("../models/Element");
const User = require("../models/User");
const Folder = require("../models/Folder");

const { removeCloudinaryFolder } = require("../middleware/cloudinary")


//RETRIEVE  INFO FROM USER
router.get("/user/:username", async (req, res, next) => {
  if (req.user) {
    const { username } = req.params;
    const { folders, layout, bio, profilePic, doesUserExist = true } = user = await User.findOne({ username }).populate({
      path: 'folders', populate: { path: 'user', select: { '_id': 1, 'username': 1 } }
    }) || { doesUserExist: false, folders: [], layout: [], bio: "", profilePic: {} };
    res.status(200).json({ folders, layout, profileInfo: { bio, profilePicId: (profilePic && profilePic.public_id) || "" }, doesUserExist, dashboardUsername: username })

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

//ADD FOLDER FROM ANOTHER USER TO OWN DASHBOARD
router.post(`/add/folder/:id`, async (req, res, next) => {
  if (req.user) {
    const { id } = req.params;
    try {
      await Folder.findOne({ _id: id }, async (err, res) => {

        if (res.isPrivate == false) { User.updateOne({ _id: req.user._id }, { $addToSet: { folders: res._id } }, async (err, res) => console.log(res)) }
      });
      res.status(200).json({ message: `folder  added` });
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
// OR REMOVE FOLDER FROM DASHBOARD IF USER IS NOT OWNER
router.delete("/:folderId", async (req, res, next) => {
  if (req.user) {
    const { folderId } = req.params;
    const folder = await Folder.findOne({ _id: folderId }).populate("user").exec();
    try {
      if (folder.user.username == req.user.username) {
        await Folder.findOneAndDelete({
          $and: [{ user: req.user._id }, { _id: folder._id }]
        }, async (err, res) => {
          await User.updateOne({ _id: req.user._id }, { $pull: { folders: res._id } })
          await Element.deleteMany({ $and: [{ user: req.user._id }, { folder: res._id }] });
          //delete also pics from cloudinary
          removeCloudinaryFolder({ id: req.user._id, folder });

        });
      }
      else {
        console.log("else"
        )
        await User.updateOne({ _id: req.user._id }, { $pull: { folders: folder._id } })
      }
      res.status(200).json({ message: `${folder} folder deleted` });
    }
    catch (err) {
      console.error(err)
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
router.get("/:username/:folder/layout", async (req, res, next) => {
  const { folder, username } = req.params;
  if (req.user) {
    try {
      const { layout } = await Folder.findOne({ path: `/${username}/${folder.replace(/ /g, "_")}` });
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