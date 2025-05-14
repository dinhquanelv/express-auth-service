const { toBoolean } = require('validator');
const { createUser, findOneByEmail, updatePassword } = require('../services/auth.service');
const { isNotEmpty, isString } = require('../utils/validate');
const {
  validateRegister,
  hashPassword,
  validateLogin,
  generateToken,
  sendEmailToResetPassword,
  verifyToken,
} = require('../utils/auth');

const authController = {
  // [POST] /api/auth/register
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      await validateRegister(username, email, password);

      const hashedPassword = await hashPassword(password);
      await createUser(username, email, hashedPassword);

      return res.status(201).json({ message: 'Register successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/login
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await validateLogin(username, password);

      if (user) {
        const accessToken = generateToken({ id: user._id }, process.env.JWT_ACCESS_KEY, '1m');
        const refreshToken = generateToken({ id: user._id }, process.env.JWT_REFRESH_KEY, '5m');

        // store tokens in cookies
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: toBoolean(process.env.COOKIES_SECURE),
          sameSite: process.env.COOKIES_SAME_SITE,
          maxAge: 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: toBoolean(process.env.COOKIES_SECURE),
          sameSite: process.env.COOKIES_SAME_SITE,
          maxAge: 5 * 60 * 1000,
        });
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others });
      }
    } catch (error) {
      next(error);
    }
  },

  // [DELETE] /api/auth/logout
  logout: (req, res, next) => {
    try {
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: toBoolean(process.env.COOKIES_SECURE),
        sameSite: process.env.COOKIES_SAME_SITE,
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: toBoolean(process.env.COOKIES_SECURE),
        sameSite: process.env.COOKIES_SAME_SITE,
      });

      return res.status(200).json({ message: 'Log out successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/password/forgot
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      isNotEmpty(email, 'Email');
      isString(email, 'Email');

      const user = await findOneByEmail(email);

      const resetToken = generateToken({ id: user._id }, process.env.JWT_RESET_KEY, '15m');
      const info = await sendEmailToResetPassword(email, resetToken);

      return res.status(200).json(info);
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/password/reset
  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.query;
      const { newPassword } = req.body;

      isNotEmpty(token, 'Token');
      isString(token, 'Token');

      isNotEmpty(newPassword, 'New Password');
      isString(newPassword, 'New Password');

      const user = verifyToken(token, process.env.JWT_RESET_KEY);
      await updatePassword(user.id, newPassword);

      return res.status(200).json({ message: 'Reset password successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // [POST] /api/auth/token/refresh
  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'You must be login!' });
      }

      const user = verifyToken(refreshToken, process.env.JWT_REFRESH_KEY);
      if (!user) {
        return res.status(403).json({ message: 'Invalid refresh token!' });
      }

      const newAccessToken = generateToken({ id: user.id }, process.env.JWT_ACCESS_KEY, '1m');

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: toBoolean(process.env.COOKIES_SECURE),
        sameSite: process.env.COOKIES_SAME_SITE,
        maxAge: 60 * 1000,
      });

      return res.status(200).json({ message: 'Refresh token successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
