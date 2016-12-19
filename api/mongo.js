import {MongoClient} from 'mongodb';
import {ObjectId} from 'mongodb';

const mongoURL = process.env.MONGO || 'mongodb://localhost:27017/chat';

let dbHandler;

export const connectDatabase = () => {
  MongoClient.connect(mongoURL, (err, db) => {
    if (err) {
      console.log('Error while connecting to the database!');
    }

    dbHandler = db;
  });
};

export const getDb = function () {
  return dbHandler;
};

export const ObjectID = function (stringID) {
  return ObjectId(stringID);
};
