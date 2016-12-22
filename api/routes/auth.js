import express from 'express';
import hash from 'password-hash';

import { authMiddleware } from '../auth/middleware';
import passport from '../auth/passport';

import { getDb } from '../mongo';

const authRouter = express.Router();

// inital route -> checks token
authRouter.get('/', authMiddleware.checkToken,(req, res) => {
  res.status(200).json(req.user);
});

authRouter.post('/login',
  passport.authenticate('local', { session: false }),
  authMiddleware.generateToken,
  authMiddleware.sendResponse,
);

authRouter.post('/register', (req, res) => {
    const db = getDb();
    db.collection('users').findOne({username: req.body.username}, (err, user) => {
      if (err) {
        return res.status(500).json({message: err});
      }

      if (user) {
        return res.status(403).json({message: 'Username already exists.'});
      } else {
        const newUser = { ...req.body, image: 'xxx', password: hash.generate(req.body.password)};

        db.collection('users').insertOne(newUser);

        return res.status(201).json({ username: newUser.username });
      }
    });
  },
);

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

authRouter.get('/facebook',
  passport.authenticate('facebook', { session: false, scope: ['public_profile'] })
);

authRouter.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, succesRedirect: '/' }),
  authMiddleware.generateToken,
  authMiddleware.sendRedirect
);

authRouter.post('/facebook', (req, res, next) => {
  const db = getDb();

  const user = {
    username: req.body.username,
    image: req.body.image,
    facebook: {
      id: req.body.id,
    },
  };

  db.collection('users').findOneAndUpdate({ username: user.username }, { $setOnInsert: user },
    { upsert: true }, (err, data, p) => {
      if (err) {
        return res.status(500).json(err);
      }

      req['user'] = user;

      next();
    });
}, authMiddleware.generateToken, authMiddleware.sendResponse);

export default authRouter;
