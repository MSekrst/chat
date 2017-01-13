import express from 'express';
import { resolve } from 'path';
import {Binary} from 'mongodb';

import {getDb} from '../mongo';
import {ObjectID} from '../mongo';
import {getConnected} from '../www';
import {authMiddleware} from '../auth/middleware';

const messageRouter = express.Router();

messageRouter.get('/', authMiddleware.checkToken, (req, res) => {
  const db = getDb();
  const user = req.user.username;
  db.collection('messages').find({'users.username': {$in: [user]}}).toArray((err, data) => {
    if (err) {
      return res.status(500).json({message: err});
    }

    return res.status(200).json(data.filter(c => c.messages.length > 0));
  });
});

messageRouter.get('/users', authMiddleware.checkToken, (req, res) => {
  const db = getDb();
  const user = req.user.username;
  db.collection('users').find().toArray((err, data) => {
    if (err) {
      return res.status(500).json({message: err});
    }

    for (let i = 0; i < data.length; i++)
      if (data[i].username == user) {
        data.splice(i, 1);
        break;
      }
    return res.status(200).json(data);
  });
});

/*
 IMPORTANT: Users array must be sorted by username!
 */
messageRouter.post('/init', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  let users = req.body.users;
  db.collection("users").findOne({username: req.user.username}, (err, data) => {

    let user = {
      username: data.username,
      image: data.image,
    };

    users.push(user);
    users = users.sort((user1, user2) => user1.username.localeCompare(user2.username));

    db.collection('messages').findOneAndUpdate({users: users}, {
        $setOnInsert: {
          title: req.body.title || '',
          messages: []
        }
      },
      {returnOriginal: false, upsert: true}, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        return res.status(200).json(data.value);
      });
  });
});

// get conversation history
messageRouter.get('/:id', authMiddleware.checkToken, (req, res) => {
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
});

messageRouter.post('/:id', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  // adds sender parameter to message
  req.body.message['sender'] = req.user.username;

  const _id = ObjectID(req.params.id);

  db.collection('messages').findOneAndUpdate({_id},
    {$push: {messages: req.body.message}}, (err, data) => {
      if (err) return res.status(500).json({message: err});

      sendToActiveUsers(data.value.users, req.user, req.body.message);

      res.status(204).json();
    });
});

messageRouter.post('/uploadFile/:id', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  const message = req.body;
  message['sender'] = req.user.username;

  const _id = ObjectID(req.params.id);

  const savedFile = {
    fileName: message.text,
    file: message.bin,
  };

  db.collection('files').insertOne(savedFile , (err, inserted) => {
    if (err) {
      return res.status(500).json(err);
    }

    message.fileId = inserted.insertedId;
    message.bin = undefined;
    db.collection('messages').findOneAndUpdate({_id},
      {$push: {messages: message}}, (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }

      sendToActiveUsers(data.value.users, req.user, message);

      res.status(200).json(message);
    });
  });
});

messageRouter.get('/getFile/:id', authMiddleware.checkToken, (req, res) => {
  const db = getDb();
  const _id = ObjectID(req.params.id);

  db.collection('files').findOne({ _id }, function (err, data) {
    if (err) {
      return res.status(500);
    }
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=' + data.fileName);

    const buf = new Buffer(data.file);
    return res.send(buf);
  });
});

messageRouter.get('/private', authMiddleware.checkToken, (req, res) => {
  const connected = getConnected();
  const username = req.user.username;
  var ip;
  for (var i = 0; i < connected.length; i++) {
    if (username == connected.user.username) {
      ip = connected.ip;
      break;
    }
  }
  const users = [];
  for (var i = 0; i < connected.length; i++) {
    if (ip == connected.ip && username == connected.user.username) {
      users.push(connected.user.username);
    }
  }
});

//  HELPERS

const sendToActiveUsers = (users, current, message) => {
  const connected = getConnected();

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < connected.length; j++) {
      if (connected[j].user === users[i].username && users[i].username !== current.username) {
        console.log('saljem');
        connected[j].socket.emit('message', message);
      }
    }
  }
};

export default messageRouter;
