const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { httpError } = require("../helpers/index");

async function signup(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({
      user: {
        email,
        subscription: savedUser.subscription,
      },
    });
  } catch (err) {
    if (err.message.includes("E11000 duplicate key error collection")) {
      throw new httpError(409, "Email in use");
    }
    throw err;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });

  if (!storedUser) {
    throw new httpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new httpError(401, "Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
  const updateUser = await User.findByIdAndUpdate(
    storedUser._id,
    { token: token },
    {
      new: true,
    }
  );

  return res.json({
    token: updateUser.token,
    user: {
      email,
      subscription: updateUser.subscription,
    },
  });
}

async function currentUser(req, res, next) {
  const { email, subscription } = req.user;
  return res.status(200).json({
    email,
    subscription,
  });
}

async function logout(req, res, next) {
  await User.findByIdAndUpdate(req.user._id, { token: null });
  return res.status(204).json();
}

module.exports = {
  signup,
  login,
  currentUser,
  logout,
};
