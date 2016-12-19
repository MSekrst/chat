import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import favicon from 'serve-favicon';
import passport from 'passport';
import { resolve } from 'path';

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

// first middleware -> redirects to HTTPS
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }

  return res.redirect('https://' + req.hostname + req.url);
});

// use routes defined in an index file
app.use('/api', routes);
// wildcard route middleware -> returns index.html for react-router to work properly
// must be last middleware -> after all routes
app.get('/*', (req, res) => {
  res.sendFile(resolve(__dirname, '../public/index.html'));
});

// // error handeling for production
// const env = process.env.NODE_ENV || 'production';
// if (env === 'production') {
//   // catch 404 and forward to error handler
//   app.use((req, res, next) => {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
//   });
//
//   // no stacktraces leaked to user
//   app.use((err, req, res) => {
//     res.status(err.status || 500);
//   });
// }

export default app;
