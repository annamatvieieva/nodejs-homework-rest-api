const express = require("express");
const {
  signup,
  login,
  currentUser,
  logout,
  uploadAvatar,
  emailVerification,
  emailSecondVerification,
} = require("../../controllers/user.controller");
const { authSchema, verifySchema } = require("../../schemas/user");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  validateBody,
  tokenValidation,
  upload,
} = require("../../middlewares/index");

const userRouter = express.Router();

userRouter.post("/signup", validateBody(authSchema), tryCatchWrapper(signup));
userRouter.post("/login", validateBody(authSchema), tryCatchWrapper(login));
userRouter.get("/current", tryCatchWrapper(tokenValidation), tryCatchWrapper(currentUser));
userRouter.post("/logout", tryCatchWrapper(tokenValidation), tryCatchWrapper(logout));
userRouter.patch("/avatars", tryCatchWrapper(tokenValidation), upload.single("avatar"), tryCatchWrapper(uploadAvatar));
userRouter.get("/verify/:verificationToken", tryCatchWrapper(emailVerification));
userRouter.post("/verify", validateBody(verifySchema), tryCatchWrapper(emailSecondVerification));

module.exports = {
  userRouter,
};
