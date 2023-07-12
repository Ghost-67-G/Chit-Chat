const {
  signUp,
  verifyemail,
  login,
  // forgetPassword,
  // newPassword,
  checkSession,
  searchUser,
  // googleLogin,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/", signUp);
router.post("/login", login);
router.get("/", protect, searchUser);
router.get("/verify-email", verifyemail);
router.get("/check-session", checkSession);
// router.post("/google-login", googleLogin);
// router.post("/forgetPassword", forgetPassword);
// router.post("/newPassword", newPassword);

module.exports = router;
