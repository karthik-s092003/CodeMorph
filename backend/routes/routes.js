const express = require("express");
const router = express.Router();

const {langCoverter} = require("../controller/langConverter")

router.route("/language-converter").post(langCoverter)

module.exports = router;