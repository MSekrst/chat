import express from 'express';

import { getDb } from '../mongo';
import { authMiddleware } from '../auth/middleware';

const messageRouter = express.Router();

messageRouter.get('/',
  (req, res) => {
    const db = getDb();

    const user = (req.user.username) ? (req.user.username) : (req.facebook.user.username);
    const conversations = db.collection('conversations').find({ username: { $in: [user] } });
    console.log(conversations);
  }
);

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
