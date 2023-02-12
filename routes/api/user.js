const express = require("express");
const {
  signup,
  login,
  currentUser,
  logout,
  uploadAvatar
} = require("../../controllers/user.controller");
const { authSchema } = require("../../schemas/user");
const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody, tokenValidation, upload } = require("../../middlewares/index");

const userRouter = express.Router();

userRouter.post("/signup", validateBody(authSchema), tryCatchWrapper(signup));
userRouter.post("/login", validateBody(authSchema), tryCatchWrapper(login));
userRouter.get(
  "/current",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(currentUser)
);
userRouter.post(
  "/logout",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(logout)
);
userRouter.patch('/avatars', tryCatchWrapper(tokenValidation), upload.single('avatar'), tryCatchWrapper(uploadAvatar));


module.exports = {
  userRouter,
};
