const express = require("express");
const {
  signup,
  login,
  currentUser,
  logout,
} = require("../../controllers/user.controller");
const { authSchema } = require("../../schemas/user");
const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody, tokenValidation } = require("../../middlewares/index");

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

module.exports = {
  userRouter,
};
