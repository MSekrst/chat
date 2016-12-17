import express from 'express';

import { authMiddleware } from '../auth/middleware';
import passport from '../auth/passport';

import { getDb } from '../mongo';

const authRouter = express.Router();

authRouter.post('/login',
  passport.authenticate('local', { session: false }),
  authMiddleware.generateToken,
  authMiddleware.sendResponse,
);

authRouter.post('/register',
  (req, res) => {
    const db = getDb();
    db.collection('users').findOneAndUpdate({ username: req.body.username }, req.body, { upsert: true }, (err, user) => {
      if (err) {
        console.log('err');
        return res.status(500).json({ message: 'err' });
      }

      if (user.value) {
        return res.status(403).json({ message: 'Username already exists.' });
      }

      return res.status(201).json(req.body);
    });
  },
);

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

authRouter.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['public_profile', 'email'] }));

authRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false, succesRedirect: '/' }), authMiddleware.generateToken, authMiddleware.sendResponse);

export default authRouter;
