const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const { nanoid } = require("nanoid");
const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
const { User } = require("../models/user");

const { SEND_GRID_KEY } = process.env;

async function signup(req, res, next) {
  const { email, password } = req.body;
  const verificationToken = nanoid();

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  avatarURL = gravatar.url(email, { protocol: "http", s: "250" });

  try {
    sgMail.setApiKey(SEND_GRID_KEY);
    const msg = {
      to: email,
      from: "matvieieva25@gmail.com",
      subject: "Please, confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verificationToken}">Confirm email</a>`,
    };

    const savedUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });
    await sgMail.send(msg);
    res.status(201).json({
      user: {
        email,
        subscription: savedUser.subscription,
      },
    });
  } catch (err) {
    if (err.message.includes("E11000 duplicate key error collection")) {
      throw new Conflict("Email in use");
    }
    throw err;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });

  if (!storedUser) {
    throw new Unauthorized("Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new Unauthorized("Email or password is wrong");
  }

  if (!storedUser.verify) {
    throw new Unauthorized("Email is not confirm");
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

async function uploadAvatar(req, res, next) {
  const { filename } = req.file;

  const uniqueNameAvatar = Math.random().toString() + filename;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(
    __dirname,
    "../public/avatars",
    uniqueNameAvatar
  );

  try {
    const resizeAvatar = await Jimp.read(tmpPath);
    resizeAvatar.resize(250, 250).write(tmpPath);
    await fs.rename(tmpPath, publicPath);
  } catch (err) {
    await fs.unlink(tmpPath);
    console.log(err.message);
  }

  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatarURL: `/public/avatars/${uniqueNameAvatar}` },
    { new: true }
  );

  if (!updateUser) {
    throw new Unauthorized("Not authorized");
  }

  return res.status(200).json({ avatarURL: updateUser.avatarURL });
}

async function emailVerification(req, res, next) {
  const { verificationToken } = req.params;

  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true }
  );

  if (!user) {
    throw new NotFound("User not found");
  }

  return res.status(200).json({ message: "Verification successful" });
}

async function emailSecondVerification(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }

  sgMail.setApiKey(SEND_GRID_KEY);
  const msg = {
    to: email,
    from: "matvieieva25@gmail.com",
    subject: "Please, confirm your email",
    html: `<a href="localhost:3000/api/users/verify/${user.verificationToken}">Confirm email</a>`,
  };

  await sgMail.send(msg);

  return res.status(200).json({ message: "Verification email sent" });
}

module.exports = {
  signup,
  login,
  currentUser,
  logout,
  uploadAvatar,
  emailVerification,
  emailSecondVerification,
};
