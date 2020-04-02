const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Element = require("../models/Element");
const User = require("../models/User")

//for now just text
router.post("/upload/text", async (req, res, next) => {
  console.log(req.body)
  if (req.user) {
    const {text}  = req.body;
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
  const arr = obj.map( e=> _.pick(e,["type","text"]));
  return res.json( arr);

});

module.exports = router;