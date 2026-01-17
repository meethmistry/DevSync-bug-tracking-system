const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const { tokenAuth } = require("../../../../shared/middlewares/auth.middleware");
const { createUploadMiddleware } = require("../../../../shared/middlewares/upload.middleware");
const uploadProfileImage = createUploadMiddleware("profiles");

const router = express.Router();

//////////////////////////////////////////////////////////////////
///////////////////////   Auth Routes   //////////////////////////
//////////////////////////////////////////////////////////////////

router.post("/send-otp", authController.sendEmail);

router.post("/verify-otp", authController.verifyEmail);

router.post("/create-account", authController.createAccount);

router.post("/login", authController.login);

router.post("/set-new-password", authController.setNewPassword);

router.post("/change-password", tokenAuth, authController.changePassword);

router.delete("/delete-account", tokenAuth, authController.deleteAccount);

router.post("/recover-account", authController.recoverAccount);

router.post("/set-pin", tokenAuth, authController.setPin);

router.post("/update-pin", tokenAuth, authController.updatePin);

router.post("/remove-pin", tokenAuth, authController.removePin);

router.post("/verify-pin", tokenAuth, authController.verifyPin);


//////////////////////////////////////////////////////////////////
///////////////////////   Users Routes   /////////////////////////
//////////////////////////////////////////////////////////////////

router.get("/get-user-profile", tokenAuth, userController.getUserProfile);

router.post("/update-user-profile", tokenAuth,
    uploadProfileImage.single("profileImage"),
    userController.updateUserProfile
);

router.post("/change-theme", tokenAuth, userController.changeTheme);

router.post("/toggle-email-notifications", tokenAuth, userController.toggleEmailNotifications);

router.post("/toggle-app-notifications", tokenAuth, userController.toggleAppNotifications);

router.post("/toggle-last-seen", tokenAuth, userController.toggleLastSeenVisibility);

router.post("/toggle-online-status", tokenAuth, userController.toggleOnlineStatusVisibility);

router.post("/update-presence", tokenAuth, userController.updatePresence);


module.exports = router;
