import express from 'express';
import hash from 'password-hash';

import { authMiddleware } from '../auth/middleware';
import passport from '../auth/passport';

import { getDb } from '../mongo';

const authRouter = express.Router();

authRouter.post('/login',
  passport.authenticate('local', { session: false }),
  authMiddleware.generateToken,
  authMiddleware.sendResponse,
);

authRouter.post('/register', (req, res) => {
  console.log('', req.body);

    const db = getDb();
    db.collection('users').findOne({username: req.body.username}, (err, user) => {
      if (err) {
        return res.status(500).json({message: err});
      }

      if (user) {
        return res.status(403).json({message: 'Username already exists.'});
      } else {
        const newUser = { ...req.body, password: hash.generate(req.body.password)};
        console.log('', newUser);

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

authRouter.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['public_profile', 'email'] }));

authRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false, succesRedirect: '/' }), authMiddleware.generateToken, authMiddleware.sendResponse);

export default authRouter;
