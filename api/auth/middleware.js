import jwt from 'jsonwebtoken';

export const authMiddleware = {
  generateToken(req, res, next) {
    const jwtSecret = process.env.JWT_SECRET || 'littleTalksBJTLKM';

    req.token = jwt.sign(req.user, jwtSecret);

    next();
  },

  sendResponse(req, res) {
    res.status(200).json({ username: req.user.username, token: req.token });
  },

  sendRedirect(req, res) {
    res.redirect('/chat?username=' + encodeURIComponent(req.user.username) + '&token=' + req.token);
  },

  checkToken(req, res, next) {
    const jwtSecret = process.env.JWT_SECRET || 'littleTalksBJTLKM';

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
        console.log("err"+ err);
        return res.status(401).send("Unauthorized");
      }

      req.user = {
        username: decoded.username,
      };

      return next();
    });
  }
};
