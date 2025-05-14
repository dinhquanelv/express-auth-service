const { APIError } = require('../error');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/auth');

const createUser = async (username, email, hashedPassword) => {
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
};

const updatePassword = async (id, newPassword) => {
  const user = await User.findById(id);
  if (!user) {
    throw new APIError('User not found!', 404);
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
};

const findOneByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError('Email not found!', 404);
  }
  return user;
};

module.exports = {
  createUser,
  updatePassword,
  findOneByEmail,
};
