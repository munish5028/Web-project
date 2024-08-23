var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const USER_CONTROLLER = require("../app/auth/controller/controller")
const {verifyToken} = require("../middleware/auth")

router.post("/signup",USER_CONTROLLER.signup)
router.put('/verifyOtp',USER_CONTROLLER.verifyOtp);
router.post("/login",USER_CONTROLLER.login)
// router.put("/edit",verifyToken,USER_CONTROLLER.editProfile)


module.exports = router;
