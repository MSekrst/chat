import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import favicon from 'serve-favicon';
import passport from 'passport';

import { connectDatabase } from './mongo';
import routes from './routes';

const app = express();

dotenv.config({ silent: true });

// connect to database
connectDatabase();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon('public/images/favicon.ico'));

// passport and sessions initialization
app.use(express.static('public'));
app.use(passport.initialize());

// use routes defined in an index file
app.use('/api', routes);

// error handeling for production
const env = process.env.NODE_ENV || 'production';
if (env === 'production') {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
  });
}

export default app;
