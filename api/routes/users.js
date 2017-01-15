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

usersRouter.get('/active', authMiddleware.checkToken, (req, res) => {
  const connected = getConnected();

  const users = [];

  for (const c of connected) {
    if (c.user !== req.user.username) {
      users.push({ username: c.user, peerId: c.peerId });
    }
  }

  res.status(200).json(users);
});

usersRouter.get('/profile', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  const username = req.user.username;
  const user = db.collection('users').findOne({username});
  user.then(data => {
    db.collection('messages').find({users: {$elemMatch: {username: data.username}}})
      .toArray((err, conversations) => {
        if (err) {
          res.status(500).json(err);
        }
        const statistic = {
          username: data.username,
          image: data.image
        };

        let numberOfConversations = 0;
        let totalSendMessages = 0;
        let totalReceivedMessages = 0;
        let firstFavourite = {};
        let secondFavourite = {};

        for (let i in conversations) {
          const conversation = conversations[i];
          const sendMessages = conversation.messages.length;
          if (sendMessages != 0) {
            numberOfConversations++;

            let send = 0;
            let received = 0;
            for (let j of conversation.messages) {
              if (j.sender == data.username) {
                totalSendMessages++;
                send++;
              } else {
                totalReceivedMessages++;
                received++;
              }
            }
            let reciever;
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

        if (Object.keys(firstFavourite.length)) {
          statistic['favourites'].push(firstFavourite);
        }
        if (Object.keys(secondFavourite.length)) {
          statistic['favourites'].push(secondFavourite);
        }

        res.status(200).json(statistic);
      });
  });
});

export default usersRouter;
