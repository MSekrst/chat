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

  const _id = ObjectID(req.params.id);
  const connected = getConnected();

  db.collection('messages').findOneAndUpdate({_id},
    {$push: {messages: req.body.message}}, (err, data) => {
      if (err) return res.status(500).json({message: err});

      const users = data.value.users;

      for(let i=0; i<users.length;i++){
        for(let j=0; j<connected.length;j++){
          if (connected[j].user == users[i].username && users[i].username != req.user.username) {
            console.log('saljem');
            connected[j].socket.emit('message', req.body.message);
          }
          if (i==users.length-1 && j==connected.length-1) res.status(200).json();
        }
      }
    });

});

messageRouter.get('/private', authMiddleware.checkToken,
  (req, res) => {
    const connected = getConnected();
    const username = req.user.username;
    var ip;
    for (var i = 0; i < connected.length; i++) {
      if (username == connected.user.username) {
        ip = connected.ip;
        break;
      }
    }
    const users = []
    for (var i = 0; i < connected.length; i++) {
      if (ip == connected.ip && username == connected.user.username) {
        users.push(connected.user.username);
      }
    }
  });

function sendMessage(users, req) {
  return new Promise((success)=> {
    const connected = getConnected();
    for (let i = 0; i < users.length; i++) {
      for (let i = 0; i < connected.length; i++) {
        if (connected[i].user == users[i].username && users[i].username != req.user.username) {
          console.log('saljem');
          connected[i].socket.emit('message', req.body.message);
          break;
        }
      }
      if (i == users.length - 1)
        return success();
    }
  });
}

export default messageRouter;
