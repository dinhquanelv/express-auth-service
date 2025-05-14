const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'You must be login!' });
    }

    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, decode) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid access token!' });
      }

      req.user = decode;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = requireAuth;
