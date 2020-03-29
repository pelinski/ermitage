const express = require("express");
const router = express.Router();
const passport = require("passport");
const { uploadCloud } = require("../lib/multerMiddleware");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const _ = require("lodash")
const User = require("../models/User");


router.post("/signup", async (req, res, next) => {

    const { username, password, email } = req.body;

    if (!username || !password) {
        return res.json({
            message: "You must enter a username and a password"
        });
    }

    const user = await User.findOne({ username })
    if (user !== null) {
        return res.status(401).json({ message: "This username already exists" });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
        username,
        password: hashPass,
        email
    });


    try {
        req.logIn(newUser, err => {
            res.status(200).json(_.pick(req.user, ["username"]));
        });
    } catch  {
        res.status(401).json({ message: "Something went wrong" });
    };
});


router.post("/login", passport.authenticate("local"), (req, res) => {
    console.log(req.user)
    return res.status(200).json(_.pick(req.user, ["username"]))
});


router.post("/logout", (req, res) => {
    if (req.user) {
        req.logout();
        res.json({ message: "Logged out" })
    } else {
        return res.status(401).json({ message: "You have to be logged in to logout" })
    }
});

router.post("/upload", uploadCloud.single("profilepic"),
    async (req, res, next) => {
        const loggedUser = req.user;
        loggedUser.image = req.file;
        await loggedUser.save();
        res.status(200).json({ message: "uploaded file" });
    }
);

router.post("/edit", async (req, res) => {
    const { username, campus, course } = req.body;
    const loggedUser = req.user;
    loggedUser.username = username;
    loggedUser.campus = campus;
    loggedUser.course = course;
    await loggedUser.save();
    res.status(200).json(_.pick(req.user, ["username"]))
})

router.get("/loggedin", (req, res) => {
    if (req.user) {
        res.status(200).json(_.pick(req.user, ["username"]))
    }
    else {
        res.status(200).json({ message: "No user logged in." })
    }
})

module.exports = router;
