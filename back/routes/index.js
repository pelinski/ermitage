const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.json({ message: "Welcome to the ermitage API" });
});



module.exports = router;
