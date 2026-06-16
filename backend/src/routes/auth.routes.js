const express = require('express');

const authController = require('../controllers/auth.controller.js');
const isLogedIn = require('../middlewares/auth.middleware.js')
//const {authLimiter} = require('../middleware/rateLimiter.middleware.js')


const router = express.Router();


router.post("/register",authController.register_controller)
router.post("/login",authController.login_controller)
router.get("/getprofile",isLogedIn,authController.getMe_controller)
router.get("/logout",isLogedIn,authController.logout_controller)

module.exports = router;