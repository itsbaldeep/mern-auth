const express = require("express");
const router = express.Router();
const { getPrivateData } = require("../controllers/private");
const { protect } = require("../middleware/auth");

// This route redirects to getPrivateData if user is already logged in with a valid token
router.route("/").get(protect, getPrivateData);

module.exports = router;
