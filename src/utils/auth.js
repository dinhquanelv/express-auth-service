const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../models/user.model');
const { APIError } = require('../error');
const { isString, isNotEmpty } = require('./validate');

const validateRegister = async (username, email, password) => {
  isNotEmpty(username, 'Username');
  isString(username, 'Username');

  isNotEmpty(email, 'Email');
  isString(email, 'Email');

  isNotEmpty(password, 'Password');
  isString(password, 'Password');

  if (!validator.isEmail(email)) {
    throw new APIError('Email is not valid!', 400);
  }

  if (!validator.isStrongPassword(password)) {
    throw new APIError('Password must be at least 8 characters long with letters, numbers, and symbols!', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (existingUser) {
    if (username === existingUser.username) {
      throw new APIError('Username already exists!', 400);
    }

    if (email === existingUser.email) {
      throw new APIError('Email already exists!', 400);
    }
  }
};

const validateLogin = async (username, password) => {
  isString(username, 'Username');
  isNotEmpty(username, 'Username');

  isString(password, 'Password');
  isNotEmpty(password, 'Password');

  const user = await User.findOne({ username });
  if (!user) {
    throw new APIError('Invalid username!', 404);
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    throw new APIError('Invalid password!', 401);
  }

  return user;
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const generateToken = (payload, jwtKey, time) => {
  return jwt.sign(payload, jwtKey, { expiresIn: time });
};

const verifyToken = (token, jwtKey) => {
  try {
    return jwt.verify(token, jwtKey);
  } catch (err) {
    console.log(err);
  }
};

const sendEmailToResetPassword = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.BASE_URL}/password/reset?token=${resetToken}`;

  const info = await transporter.sendMail({
    from: `"Your Website" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your Your Website account password',
    html: `<h3>Reset your Your Website account password</h3>
          <p>Click <a href="${resetLink}">here</a> to reset your password</p>
          <p>If not you, you can ignore this email!</p>`,
  });

  return info;
};

module.exports = {
  validateRegister,
  validateLogin,
  hashPassword,
  generateToken,
  verifyToken,
  sendEmailToResetPassword,
};
