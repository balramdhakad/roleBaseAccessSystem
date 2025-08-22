const express = require("express")
const authControllers = require("../Controllers/authController")

const router = express.Router()

router.post("/login",authControllers.loginUser)
router.post("/signup",authControllers.registerUser)




module.exports = router