const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();
const {adminAuth} = require("../../../../shared/middlewares/auth.middleware");


///////////////////// Admin Auth /////////////////////////////////
router.post("/login", controller.login);
router.post("/logout", adminAuth, controller.logout);
router.post("/change-pin", adminAuth, controller.changePin);
router.get("/me", adminAuth, controller.me);
router.post("/logout-all", adminAuth, controller.logoutAll);


module.exports = router;
