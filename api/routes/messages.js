import express from 'express';

import { getDb } from '../mongo';
import { authMiddleware } from '../auth/middleware';

const messageRouter = express.Router();

messageRouter.get('/',
  (req, res) => {
    const db = getDb();

  const user = (req.user.username) ? (req.user.username) : (req.facebook.user.username);
  db.collection('conversations').find({ 'users.username': { $in: [user] } }).toArray((err, data) => {
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

  db.collection('conversations').insertOne({
    "title": req.body.title,
    "users": users,
    "conversation": []
  }).then(conversation => {
    return res.status(201).json(conversation);
  }).catch( err => {
    console.log(err);
    return res.status(500).json( { message: "err" } );
  });
});

messageRouter.get('/:title',
  (req, res) => {
    const db = getDb();

    const title = req.params.title;
    const conversation = db.collection('conversations').findOne({title});

    conversation.then(data => {
        res.end(data);
    }).catch(err => {
      console.log(err);
    });
  }
);

messageRouter.post('/:title',
  (req, res) => {
    const db = getDb();

    const title = req.params.title;
    db.collection('conversations').findOneAndUpdate( {title: title}, {$pushAll: {'conversation': req.body}}, { upsert: true }, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'err' });
      }

      return res.status(204).json(req.body);
    });
  }
);
export default messageRouter;
