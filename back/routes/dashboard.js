const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Element = require("../models/Element");
const User = require("../models/User");
const Folder = require("../models/Folder");




// ELEMENTS 

//for now just text
router.post("/upload/text", async (req, res, next) => {
  if (req.user) {
    const { text } = req.body;
    if (typeof text == 'string') {
      const newElement = await Element.create({
        type: "text",
        text: text,
        user: req.user._id
      })
      await User.updateOne({ _id: req.user._id }, { $push: { elements: newElement._id } })
      res.status(200).json({ message: "Element created" })

    } else if (typeof text != "string") {
      res.status(500).json({ message: "This route is for text" });
    }
  } else {
    res.status(401).json({ message: "You must be logged in to upload stuff" })
  }

})


// Retrieve WITH PAGINATION
router.get("/", async (req, res, next) => {
  //await Element.find().populate("user");
  const obj = await Element.find({ user: req.user._id });
  const arr = obj.map(e => _.pick(e, ["type", "text"]));
  return res.json(arr);

});



//FOLDERS 
router.post("/create/folder", async (req, res, next) => {
  console.log("inroute")
  const { layout, folder } = req.body;
  try {
    await Folder.create({
      folder,
      user: req.user._id,
      layout
    })
    res.status(200).json({ message: `${folder} folder created` });
  }
  catch {
    res.status(500).json({ message: "Something went wrong" })
  }
})

router.post("update/folder", async (req, res, next) => {
  const { layout, folder } = req.body;
  try {
    const FolderToUpdate =  await Folder.find({
      folder,
      user: req.user._id,
    })
    FolderToUpdate.updateOne({folder:folder, layout:layout});
    FolderToUpdate.save();
    res.status(200).json({ message: `${folder} folder update` });
  }
  catch {
    res.status(500).json({ message: "Something went wrong" })
  }

})







module.exports = router;