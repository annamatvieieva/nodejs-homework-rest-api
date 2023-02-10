const express = require("express");
const {currentUser} = require('../../controllers/user.controller');
const {tryCatchWrapper} = require('../../helpers/index');
const {validateBody, auth} = require('../../middlewares/index');

const userRouter = express.Router();


userRouter.get("/current", validateBody(auth), tryCatchWrapper(currentUser));

module.exports = {
	userRouter,
};