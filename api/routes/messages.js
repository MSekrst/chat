import express from 'express';

import { getDb } from '../mongo';

const messageRouter = express.Router();

messageRouter.get('/', (req, res) => {
  const db = getDb();

  const user = (req.user.username) ? (req.user.username) : (req.facebook.user.username);
  const conversations = db.collection('conversations').find({ username: { $in: [user] } });
  console.log(conversations);
});

export default messageRouter;
