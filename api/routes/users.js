import express from 'express';

import {authMiddleware} from '../auth/middleware';
import {getDb, ObjectID} from '../mongo';
import {getConnected} from '../www';

const usersRouter = express.Router();

usersRouter.get('/', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  db.collection('users').find({username: {$nin: [req.user.username]}}).toArray((err, users) => {
    if (err) {
      res.status(500).json(err);
    }

    res.status(200).json(users);
  });
});

usersRouter.get('/private', authMiddleware.checkToken, (req, res) => {
  const connected = getConnected();

  // TODO - (Matija) - FIX 500

  const username = req.user.username;
  let ip;

  for (let i = 0; i < connected.length; i++) {
    if (username == connected.user.username) {
      ip = connected.ip;
      break;
    }
  }

  console.log('my ip', ip);

  const users = [];
  for (let i = 0; i < connected.length; i++) {
    console.log('con ip', connected.ip);
    if (ip == connected.ip && username == connected.user.username) {
      users.push(connected.user.username);
    }
  }

  res.status(200).json(users);
});

usersRouter.get('/profile', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  const username = req.user.username;
  const user = db.collection('users').findOne({username});
  user.then(data => {
    const conversation = db.collection('messages').find({users: {$elemMatch: {username: data.username}}}).toArray((err, conversations) => {
      if (err) {
        res.status(500).json(err);
      }
      var statistic = {
        username: data.username,
        image: data.image
      }

      var numberOfConversations = 0;
      var totalSendMessages = 0;
      var totalReceivedMessages = 0;
      var firstFavourite = {};
      var secondFavourite = {};

      for (var i in conversations) {
        var conversation = conversations[i];
        var sendMessages = conversation.messages.length;
        if (sendMessages != 0) {
          numberOfConversations++;

          var send = 0;
          var received = 0;
          for (var i in conversation.messages) {
            if (conversation.messages[i].sender == data.username) {
              totalSendMessages++;
              send++;
            } else {
              totalReceivedMessages++;
              received++;
            }
          }
          var reciever;
          if (conversation.users[0].username == data.username) {
            reciever = conversation.users[1];
          } else {
            reciever = conversation.users[0];
          }
          if (firstFavourite.sendMessages == undefined || firstFavourite.sendMessages < sendMessages) {
            secondFavourite = firstFavourite;
            firstFavourite = {
              username: reciever.username,
              img: reciever.image,
              sendMessages: send,
              receivedMessages: received
            }
          } else if (secondFavourite.sendMessages == undefined || secondFavourite.sendMessages < sendMessages) {
            secondFavourite = {
              username: reciever.username,
              img: reciever.image,
              sendMessages: send,
              receivedMessages: received
            }
          }
        }
      }
      statistic['numberOfConversations'] = numberOfConversations;
      statistic['totalSendMessages'] = totalSendMessages;
      statistic['totalReceivedMessages'] = totalReceivedMessages;
      statistic['favourites'] = [];
      statistic['favourites'].push(firstFavourite);
      statistic['favourites'].push(secondFavourite);

      res.status(203).json(statistic);
    });
  });
});

export default usersRouter;
