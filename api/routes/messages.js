import express from 'express';
import fs from 'fs';
import multipart from 'connect-multiparty';
import {Binary} from 'mongodb';

import {getDb} from '../mongo';
import {ObjectID} from '../mongo';
import {getConnected} from '../www';
import {authMiddleware} from '../auth/middleware';

const multipartMiddleware = multipart();

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

// ova ruta radi za android, ako ju je potrebno mijenjati napraviti novu rutu :D
// VAŽNO: useri u bazi moraju biti sortirani po usernameu i oblika _id, image, username da bi radilo!!!!
messageRouter.post('/init', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  let users = req.body.users;

  db.collection("users").findOne({"_id": ObjectID(req.user._id)}, (err, data) => {
    let user = {
      image : data.image,
      username : data.username
  };

    users.push(user);
    users = users.sort((user1, user2) =>  user1.username.localeCompare(user2.username));

    db.collection('messages').findOneAndUpdate({ users: users }, { $setOnInsert: { title: req.body.title || '', messages:[] } },
      { returnOriginal: false, upsert: true },(err, data) => {
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

// ova ruta radi za android, ako ju je potrebno mijenjati napraviti novu rutu :D
messageRouter.post('/:id', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  // adds sender parameter to message
  req.body.message['sender'] = req.user.username;

  const _id = ObjectID(req.params.id);
  const connected = getConnected();

  console.log('', req.body.message);

  db.collection('messages').findOneAndUpdate({_id},
    {$push: {messages: req.body.message}}, (err, data) => {
      if (err) return res.status(500).json({message: err});

      const users = data.value.users;

      console.log('users', users);
      console.log('live', connected);

      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < connected.length; j++) {
          if (connected[j].user == users[i].username && users[i].username != req.user.username) {
            console.log('saljem');
            connected[j].socket.emit('message', req.body.message);
          }

          if (i == users.length - 1 && j == connected.length - 1) res.status(200).json();
        }
      }
    });
});

messageRouter.post('/uploadFile/:id', authMiddleware.checkToken, multipartMiddleware, (req, res) => {
  const db = getDb();
  const connected = getConnected();

  req.body.message['sender'] = req.user.username;
  const _id = ObjectID(req.params.id);
  var message = req.body.message;
  var fileName = req.files.file.originalFilename;
  var filePath = req.files.file.path;
  message.type = "file";
  message.fileName = fileName;

  var bin = fs.readFile(filePath, (err, data) => {

    db.collection('files').insertOne({
      fileName: fileName,
      file: Binary(data),
    }, (err, inserted) => {
      if (err) {
        return res.status(500).json(err);
      }
      message.fileId = inserted.insertedId;

      db.collection('messages').updateOne({_id}, {
        $push: {messages: message}
      }, err => {
        if (err) {
          return res.status(500).json({message: err});
        }
      });
    });
    console.log('', req.body.message);
  });
  // for (let i = 0; i < data.users.length; i++) {
  //   for (let i = 0; i < connected.length; i++) {
  //     if (connected[i].user == data.users[i].username && data.users[i].username != req.user.username) {
  //       console.log('saljem', req.body.message);
  //       connected[i].socket.emit('message', req.body.message);
  //       break;
  //     }
  //   }
  // }
  fs.unlink(filePath, () => {
  });
  return res.status(204).json();

});

messageRouter.get('/getFile/:id', authMiddleware.checkToken, (req, res) => {
  const db = getDb();
  const _id = ObjectID(req.params.id);

  db.collection('files').findOne({_id}, function (err, data) {
    if (err) {
      console.error(err);
    }
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=' + data.fileName);

    return res.send(data.file.buffer);
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


export default messageRouter;
