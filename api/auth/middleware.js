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

    if (!header) {
      return res.status(401).send("Unauthorized");
    }

    const split = header.split(' ');

    if (split.length != 2) {
      return res.status(401).send("Unauthorized");
    }

    const token = split[1];

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }

      req.user = {
        username: decoded.username,
        _id: decoded._id,
      };
      
      return next();
    });
  }
};
