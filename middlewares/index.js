const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { httpError } = require("../helpers/index");
const { User } = require("../models/user");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = new httpError(400, error.message);
      return next(err);
    }
    return next();
  };
}

function idContactsValidation (contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new httpError (400, "Id is not valid");
  } else {
    return;
  } 
};

async function tokenValidation(req, res, next) {
  const reqHeader = req.headers.authorization || "";
  const [type, token] = reqHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new httpError(401, "Token type is not valid or there is no token");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      throw new httpError(401, "Token is not valid");
    }
    throw new httpError(401, "Not authorized");
  }
  next();
}

module.exports = {
  validateBody,
  idContactsValidation,
  tokenValidation,
};
