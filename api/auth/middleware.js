import jwt from 'jsonwebtoken';

export const authMiddleware = {
  generateToken(req, res, next) {
    const jwtSecret = process.env.JWT_SECRET;

    req.token = jwt.sign(req.user, jwtSecret);

    next();
  },

  sendResponse(req, res) {
    res.status(200).json({
      token: req.token,
    });
  },

  checkToken(req, res, next) {
    const jwtSecret = process.env.JWT_SECRET;

    const header = req.get('Authorization');

    const token = header.split(' ')[1];

    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      username: decoded.username,
      _id: decoded._id,
    };

    next();
  }
};
