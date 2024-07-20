const express = require("express");
const router = express.Router();

const {langCoverter} = require("../controller/langConverter")
const {errorCorrector} = require("../controller/errorCorrector")

router.route("/language-converter").post(langCoverter)
router.route("/error-corrector").post(errorCorrector)

module.exports = router;