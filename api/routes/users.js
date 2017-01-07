import express from 'express';

import { authMiddleware } from '../auth/middleware';
import { getDb } from '../mongo';

const usersRouter = express.Router();

usersRouter.get('/', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  db.collection('users').find({ username: { $nin: [req.user.username] } }).toArray((err, users) => {
    if (err) {
      res.status(500).json(err);
    }

    res.status(200).json(users);
  });
});

export default usersRouter;
