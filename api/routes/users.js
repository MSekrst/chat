import express from 'express';

import {authMiddleware} from '../auth/middleware';
import {getDb} from '../mongo';

import {ObjectID} from '../mongo';

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


usersRouter.get('/:id', authMiddleware.checkToken, (req, res) => {
  const db = getDb();

  const _id = ObjectID(req.params.id);
  const user = db.collection('users').findOne({_id});
  user.then(data => {
    const conversation = db.collection('messages').find({users: {$elemMatch: {username: data.username}}}).toArray((err, conversations) => {
      if (err) {
        res.status(500).json(err);
      }
      delete data['password'];
      delete data['facebook'];

      var statistic = {
        user: data
      }

      var numberOfConversations = 0;
      var totalSendMessages = 0;
      var totalReceivedMessages = 0;
      var firstFavourite = {};
      var secondFavourite = {};

      for (var i in conversations) {
        var conversation =  conversations[i];
        var sendMessages = conversation.messages.length;
        if (sendMessages != 0) {
          numberOfConversations++;

          for(var i in conversation.messages) {
            if(conversation.messages[i].sender == data.username) {
              totalSendMessages++;
            } else {
              totalReceivedMessages++;
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
              sendMessages: sendMessages
            }
          } else if (secondFavourite.sendMessages == undefined || secondFavourite.sendMessages < sendMessages) {
            secondFavourite = {
              username: reciever.username,
              img: reciever.image,
              sendMessages: sendMessages
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

      console.log(statistic);
      res.status(200).json(statistic);
    });
  });

});

export default usersRouter;
