const express = require("express");
const router = express.Router();
const passport = require("passport");
const { hashPassword } = require("../lib/hashing");
const { uploadCloudinaryProfilePic } = require("../middleware/cloudinary");
const User = require("../models/User");

const errorMsg = { message: "Something went wrong" };


// SIGN UP
router.post("/signup", async (req, res, next) => {

    const { username, password, email } = req.body;

    // All fields required
    if (!username || !password || !email) {
        return res.status(406).json({

            message: "All fields are required"
        });
    };

    // No duplicated usernames
    const user = await User.findOne({ username })
    if (user !== null) {
        console.log("username already exists")
        return res.status(406).json({ message: "Sorry, this username already exists" });
    }

    // No duplicated emails
    const existingEmail = await User.findOne({ email });
    if (existingEmail !== null) {
        return res.status(406).json({ message: "There is already an account linked to this email" });
    }

    // Secure passwords
    //const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


    if (mediumRegex.test(password)) {
        const hashPass = hashPassword(password)

        const newUser = await User.create({
            username: username.toLowerCase(),
            password: hashPass,
            email,
        });

        try {
            req.logIn(newUser, err => {

                res.status(200).json({ message: `Created user '${username}'` });
            });
        } catch  {
            res.status(500).json(errorMsg);
        };

    } else {
        res.status(406).json({ message: "Password is not secure enough" });
    }
});

//LOGIN
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err); // will generate a 500 error
        }
        if (!user) {
            return res.status(401).json({ message: 'The credentials you entered are wrong' });
        }

        req.login(user, loginErr => {
            if (loginErr) {
                next(loginErr);
            }
            return res.status(200).json({ message: 'Authentication succeeded' });
        });
    })(req, res, next);
});


//LOGOUT
router.post("/logout", (req, res) => {
    if (req.user) {
        req.logout();
        res.status(200).json({ message: "Logged out" })
    } else {
        res.status(401)
    }
});

//UPLAOD PROFILE PIC
router.post("/upload/profilepic", uploadCloudinaryProfilePic.single("profilepic"),
    async (req, res, next) => {
        const loggedUser = req.user;
        loggedUser.profilePic = req.file;
        await loggedUser.save();
        res.status(200).json({ message: "uploaded file" });
    }
);



//UPDATE USER
/*
router.post("/update", async (req, res) => {
    try {
        const { username, email, password, displayName } = req.body;
        const loggedUser = req.user;
        loggedUser.username = username;
        loggedUser.email = email;
        loggedUser.displayName = displayName;
        loggedUser.password = hashPassword(password);
        await loggedUser.save();
        res.status(200).json(({ message: 'User updated' }))
    }
    catch {
        res.status(400).json(errorMsg)
    }
})*/

//UPDATE BIO
router.post("/update/bio", async (req, res) => {
    if (req.user) {
        const { bio } = req.body;
        await User.updateOne({ _id: req.user._id }, { bio });
        res.status(200).json({ message: "bio updated" });
    } else {
        res.status(401)
    }
})

//IS USER LOGGED IN?
router.get("/loggedin", (req, res) => {
    try {
        if (req.user) {
            res.status(200).json({ message: `${req.user.username} is logged in` })
        }
        else {
            res.status(200).json({ message: "No user logged in." })
        }
    } catch {
        res.status(400).json(errorMsg)
    }
})

// WHOAMI
router.get("/whoami", async (req, res, next) => {
    if (req.user) {
        const { username, _id } = await User.findOne({ username: req.user.username });
        return res.json({ username, _id });
    }

    else return res.status(401).json({ status: "No user session present" });
});


//GET PROFILE INFO
router.get("/profile/:username", async (req, res) => {
    if (req.user) {
        const { username } = req.params;
        const { bio, profilePic: { public_id: profilePicId } } = await User.findOne({ username });
        return res.status(200).json({ bio, profilePicId });
    } else {
        res.status(401)
    }
})


module.exports = router;
