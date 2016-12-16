import express from 'express';

import { authMiddleware } from '../auth/middleware';
import passport from '../auth/passport';

const authRouter = express.Router();

authRouter.post('/login',
  passport.authenticate('local', { session: false }),
  authMiddleware.generateToken,
  authMiddleware.sendResponse,
);

authRouter.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['public_profile', 'email'] }));

authRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false, succesRedirect: '/' }), authMiddleware.generateToken, authMiddleware.sendResponse);

export default authRouter;
