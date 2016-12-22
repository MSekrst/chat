import express from 'express';

import {getDb} from '../mongo';
import {ObjectID} from '../mongo';
import {getConnected} from '../www';
import {authMiddleware} from '../auth/middleware';

const messageRouter = express.Router();

messageRouter.get('/', authMiddleware.checkToken,
  (req, res) => {
    const db = getDb();
    const user = req.user.username;
    db.collection('messages').find({'users.username': {$in: [user]}}).toArray((err, data) => {
      if (err) {
        return res.status(500).json({message: err});
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

// get conversation hitory
messageRouter.get('/:id', authMiddleware.checkToken,
  (req, res) => {
    const db = getDb();

    const _id = ObjectID(req.params.id);

    const conversation = db.collection('messages').findOne({_id});

    conversation.then(data => {
      if (!data) {
        res.status(404).json({message: "Route does not exist"});
      } else {
        res.status(200).json(data.messages);
      }
    }).catch(err => {
      res.status(500).json(err);
    });
  }
);

messageRouter.post('/:id', authMiddleware.checkToken, (req, res) => {
  const db = getDb();
  const connected = getConnected();

  req.body.message['sender'] = req.user.username;
  const _id = ObjectID(req.params.id);

  const users = db.collection('messages').findOne({_id});

  users.then(data => {
    for (let i = 0; i < data.users.length; i++) {
      for (let i = 0; i < connected.length; i++) {
        if (connected[i].user == data.users[i].username && data.users[i].username != req.user.username) {
          console.log('saljem');
          connected[i].socket.emit('newMessage', req.body.message);
          break;
        }
      }
    }
  });

  db.collection('messages').updateOne({_id}, {
    $push: {messages: req.body.message}
  }, err => {
    if (err) {
      return res.status(500).json({message: err});
    }

    return res.status(204).json();
  });
});

export default messageRouter;
