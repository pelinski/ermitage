const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Element = require("../models/Element");
const User = require("../models/User");
const Folder = require("../models/Folder");

const authErrorMsg = { message: "Unauthorized" };


// ELEMENTS 

//for now just text
router.post("/upload/text", async (req, res, next) => {
  if (req.user) {
    const { text, folder } = req.body;
    if (typeof text == 'string') {
      const folderForElement = await Folder.findOne({ $and: [{ user: req.user._id }, { folder }] });
      const newElement = await Element.create({
        type: "text",
        text: text,
        folder: folderForElement._id,
        user: req.user._id
      })
      await User.updateOne({ _id: req.user._id }, { $push: { elements: newElement._id } })
      res.status(200).json({ message: "Element created" })

    } else if (typeof text != "string") {
      res.status(500).json({ message: "This route is for text" });
    }
  } else {
    res.status(401).json(authErrorMsg)
  }

})


// Retrieve WITH PAGINATION
router.get("/", async (req, res, next) => {
  //await Element.find().populate("user");
  const { folder } = req.body;
  const folderRef = await Folder.find({ $and: [{ user: req.user._id }, { folder }] });
  const obj = await Element.find({ $and: [{ user: req.user._id }, { folder: folderRef._id }] });
  const arr = obj.map(e => _.pick(e, ["type", "text"]));
  return res.json(arr);

});


/////////////
//FOLDERS///

//Retrieve user folders
router.get("/folders", async (req, res, next) => {
  if (req.user) {
    const {folders} = await User.findOne({ _id: req.user._id }).populate("folders");
    res.status(200).json(folders)
  } else {
    res.status(401).json(authErrorMsg)
  }
});


//Create folder
router.post("/create/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;
    try {
      const newFolder = await Folder.create({
        folder,
        user: req.user._id,
        path: `/${req.user.username}/${folder.replace(/ /g, "_")}`
      })
      await User.updateOne({ _id: req.user._id }, { $push: { folders: newFolder._id } });
      res.status(200).json({ message: `${folder} folder created` });
    }
    catch {
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401).json(authErrorMsg)
  }

})


router.delete("/:folder", async (req, res, next) => {
  if (req.user) {
    const { folder } = req.params;

    try {
      await Folder.findOneAndDelete({
        $and: [
          { folder },
          { user: req.user._id },
          { path: `/${req.user.username}/${folder}` }]
      },async(err,res)=> (await User.updateOne({_id: req.user._id},{$pull: {"folders":res._id}})));
      
      res.status(200).json({ message: `${folder} folder deleted` });
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Something went wrong" })
    }
  } else {
    res.status(401).json(authErrorMsg)
  }

})



router.post("/update/layout", async (req, res, next) => {
  
  if (req.user) {
    const { layout } = req.body;
    console.log("inroute")
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





//RETRIEVE CONTENT from A FOLDER
router.get("/:folder", async (req, res, next) => {

  const { folder } = req.params;

  if (req.user) {
    const folderRef = await Folder.find({ $and: [{ user: req.user._id }, { folder }] });

    const elements = await Element.find({ $and: [{ user: req.user._id }, { folder: folderRef[0]._id }] });

    res.status(200).json(elements)
  } else {
    res.status(401).json({ message: "You must be logged in" })
  }
}
)




module.exports = router;