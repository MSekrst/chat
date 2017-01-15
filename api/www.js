/* eslint-disable no-console */

import http from 'http';
import https from 'https';
import fs from 'fs';
import socketio from 'socket.io';
import { resolve } from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import favicon from 'serve-favicon';
import passport from 'passport';
import { PeerServer } from 'peer';

dotenv.config({ silent: true });

import routes from './routes';
import { connectDatabase } from './mongo';

const app = express();

// connect to database
connectDatabase();

// get ports
const port = process.env.PORT || 3080;
const sPort = process.env.SPORT || 3000;
const peerPort = process.env.PEER_PORT || 9000;

// middlewares
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({ extended: false, limit: '16mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '16mb' }));
app.use(favicon('public/images/favicon.ico'));

// passport initialization
app.use(express.static('public'));
app.use(passport.initialize());

// HTTP Server
const server = http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers.host + ":" + sPort + req.url });
  res.end();
});

// HTTPS Server
const options = {
  key: fs.readFileSync(resolve('./cert/server.key')),
  cert: fs.readFileSync(resolve('./cert/server.crt'))
};

const optionsProduction = {
  // key: fs.readFileSync(resolve('/etc/letsencrypt/archive/chitchat.cf/privkey1.pem')),
  // cert: fs.readFileSync(resolve('/etc/letsencrypt/archive/chitchat.cf/fullchain1.pem'))
};

const sServer = https.createServer(options, app);
const peerServer = PeerServer({ port: peerPort, ssl: options, path: '/' });

// use routes defined in an index file
app.use('/api', routes);
// wildcard route middleware -> returns index.html for react-router to work properly
// must be last middleware -> after all routes
app.get('/*', (req, res) => {
  res.sendFile(resolve(__dirname, '../public/index.html'));
});

// Sockets
const userSockets = [];

const io = socketio.listen(sServer);

io.on('connection', socket => {
  socket.on('user', user => {
    const ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    console.log('Connected:', user.username, user.peerId, ip);
    const newUserSocket = {
      user: user.username,
      socket: socket,
      peerId: user.peerId,
      ip: ip,
    };

    userSockets.push(newUserSocket);
  });

  socket.on('userAndroid', user => {
    console.log('Connected via mobile: ' + user);
    const newUserSocket = {
      user: user,
      socket: socket,
      ip: socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress,
      mobile: true
    };

    userSockets.push(newUserSocket);
  });

  socket.on('disconnect', () => {
    for (let i = 0; i < userSockets.length; i++) {
      if (userSockets[i].socket == socket) {
        console.log("Disconnected: " + userSockets[i].user);
        userSockets.splice(i, 1);
      }
    }
  });
});

// STARTUP
console.log('HTTPS server is running on port', sPort, 'and HTTP is on port', port);
server.listen(port);
sServer.listen(sPort);

export const getConnected = function () {
  return userSockets;
};
