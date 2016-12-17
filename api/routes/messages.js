import express from 'express';

import { getDb } from '../mongo';
import { authMiddleware } from '../auth/middleware';

const messageRouter = express.Router();

messageRouter.get('/', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  const user = (req.user.username) ? (req.user.username) : (req.facebook.user.username);
  db.collection('messages').find({ 'users.username': { $in: [user] } }).toArray((err, data) => {
    if(err) {
      console.log(err);
      return res.status(500).json( { message: "err" } );
    }

    return res.status(200).json(data);
  });
});

messageRouter.post('/init', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  let users = req.body.users;
  users.push(req.user);

  db.collection('messages').insertOne({
    "title": req.body.title,
    "users": users,
    "message": []
  }).then(conversation => {
    return res.status(201).json(conversation);
  }).catch( err => {
    console.log(err);
    return res.status(500).json( { message: "err" } );
  });
});

export default messageRouter;
