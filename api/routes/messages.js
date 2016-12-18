import express from 'express';

import { getDb } from '../mongo';
import { authMiddleware } from '../auth/middleware';

const messageRouter = express.Router();

messageRouter.get('/', authMiddleware.checkToken,
  (req, res) => {
    const db = getDb();

  const user = req.user.username;
  db.collection('messages').find({ 'users.username': { $in: [user] } }).toArray((err, data) => {
    if(err) {
      return res.status(500).json( { message: err } );
    }

    return res.status(200).json(data);
  });
});

messageRouter.post('/init', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  let users = req.body.users;
  users.push(req.user);

  db.collection('messages').insertOne({
    title: req.body.title,
    users,
    messages: []
  }, (err, inserted) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(inserted.insertedId);
  });
});

messageRouter.get('/:title', authMiddleware.checkToken,
  (req, res) => {
    const db = getDb();

    const title = req.params.title;
    const conversation = db.collection('messages').findOne({title});

    conversation.then(data => {
        if (!data) {
          res.status(404).json({ message: "Route does not exist" });
        } else {
          res.status(200).json(data);
        }
    }).catch(err => {
      res.status(500).json(err);
    });
  }
);

messageRouter.post('/:title', authMiddleware.checkToken,
  (req, res) => {
    const db = getDb();

    const title = req.params.title;
    db.collection('messages').findOneAndUpdate( {title: title}, {$pushAll: {'messages': req.body.messages}}, { upsert: true }, err => {
      if (err) {
        return res.status(500).json({ message: err });
      }

      return res.status(204).json();
    });
  }
);
export default messageRouter;
