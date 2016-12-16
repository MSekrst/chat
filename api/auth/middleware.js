import jwt from 'jsonwebtoken';

export const authMiddleware = {
  generateToken(req, res, next) {
    const jwtSecret = process.env.JWT_SECRET;

    console.log('generate Token', req.user);

    req.token = jwt.sign(req.user, jwtSecret);

    next();
  },

  sendResponse(req, res) {
    res.status(200).json({
      token: req.token,
    });
  },
};
