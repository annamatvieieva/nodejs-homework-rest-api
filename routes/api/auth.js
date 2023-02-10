const express = require("express");
const {register, login} = require('../../controllers/auth.conroller');
const {tryCatchWrapper} = require('../../helpers/index');
const {validateBody} = require('../../middlewares/index');
const {authSchema} = require('../../schemas/auth');

const authRouter = express.Router();


authRouter.post("/register", validateBody(authSchema), tryCatchWrapper(register));
authRouter.post("/login", validateBody(authSchema), tryCatchWrapper(login));

module.exports = {
	authRouter,
};