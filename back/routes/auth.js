const express = require("express");
const router = express.Router();
const passport = require("passport");
//const { uploadCloud } = require("../lib/multerMiddleware");
const { hashPassword } = require("../lib/hashing");
const User = require("../models/User");

const errorMsg = { success: false, message: "Something went wrong" };


// SIGN UP
router.post("/signup", async (req, res, next) => {

    const { username, password, email, displayName } = req.body;

    // All fields required
    if (!username || !password || !email || !displayName) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };

    // No duplicated usernames
    const user = await User.findOne({ username })
    if (user !== null) {
        return res.status(401).json({ success: false, message: "Sorry, this username already exists" });
    }

    // No duplicated emails
    const existingEmail = await User.findOne({ email });
    if (existingEmail !== null) {
        return res.status(401).json({ success: false, message: "There is already an account linked to this email" });
    }

    // Secure passwords
    //const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


    if (mediumRegex.test(password)) {
        const hashPass = hashPassword(password)

        const newUser = await User.create({
            username,
            password: hashPass,
            email,
            displayName
        });

        try {
            return req.logIn(newUser, err => {
                res.status(200).json({ success: true, message: `Created user '${username}'` });
            });
        } catch  {
            return res.status(400).json(errorMsg);
        };

    } else {
        return res.status(401).json({ success: false, message: "Password is not secure enough" });
    }
});

//LOGIN
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }

        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).json({ success: true, message: 'Authentication succeeded' });
        });
    })(req, res, next);
});


//LOGOUT
router.post("/logout", (req, res) => {
    if (req.user) {
        req.logout();
        return res.status(200).json({ success: true, message: "Logged out" })
    } else {
        return res.status(401).json({ success: false, message: "You have to be logged in to logout" })
    }
});

/*
router.post("/upload", uploadCloud.single("profilepic"),
    async (req, res, next) => {
        const loggedUser = req.user;
        loggedUser.image = req.file;
        await loggedUser.save();
        res.status(200).json({ message: "uploaded file" });
    }
);*/


//UPDATE USER
router.post("/update", async (req, res) => {
    try {
        const { username, email, password, displayName } = req.body;
        const loggedUser = req.user;
        loggedUser.username = username;
        loggedUser.email = email;
        loggedUser.displayName = displayName;
        loggedUser.password = hashPassword(password);
        await loggedUser.save();
        return res.status(200).json(({ success: true, message: 'User updated' }))
    }
    catch {
        return res.status(400).json(errorMsg)
    }
})

//IS USER LOGGED IN?
router.get("/loggedin", (req, res) => {
    try {
        if (req.user) {
            return res.status(200).json({ success: true, message: `${req.user.username} is logged in` })
        }
        else {
            return res.status(200).json({ succes: true, message: "No user logged in." })
        }
    } catch {
        return res.status(400).json(errorMsg)
    }
})

module.exports = router;
