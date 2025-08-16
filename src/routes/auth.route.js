const express = require("express");
const { postRegisterController, postLoginController } = require("../controllers/auth.controller");


const router = express.Router();


router.post("/register", postRegisterController)
router.post("/login", postLoginController)


module.exports = router;


