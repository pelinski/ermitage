require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const logger = require('morgan');
const cors = require("cors");
const path = require('path');



mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


// Cross Domain CORS whitlist
const whitelist = [process.env.BACK_URL, process.env.FRONT_URL];
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`Origin: ${origin}`);
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};


// Middleware Setup
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
require("./passport")(app);




const index = require('./routes/index');
app.use('/', index);
const auth = require("./routes/auth");
app.use("/auth", auth);
const dashboard = require("./routes/dashboard");
app.use("/dashboard", dashboard);
const elements = require("./routes/elements");
app.use("/elements", elements);


module.exports = app;
