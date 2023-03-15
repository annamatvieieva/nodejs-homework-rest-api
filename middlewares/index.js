const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { BadRequest, Unauthorized } = require("http-errors");
const { User } = require("../models/user");

const { JWT_SECRET } = process.env;

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = new BadRequest(error.message);
      return next(err);
    }
    return next();
  };
}

function idContactsValidation(contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new BadRequest("Id is not valid");
  } else {
    return;
  }
}

async function tokenValidation(req, res, next) {
  const reqHeader = req.headers.authorization || "";
  const [type, token] = reqHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new Unauthorized("Token type is not valid or there is no token");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      throw new Unauthorized("Token is not valid");
    }
    throw new Unauthorized("Not authorized");
  }
  next();
}

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../tmp"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = {
  validateBody,
  idContactsValidation,
  tokenValidation,
  upload,
};
