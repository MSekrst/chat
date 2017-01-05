/* eslint-disable no-console */

import debug from 'debug';
import http from 'http';
import https from 'https';
import fs from 'fs';
import {resolve} from 'path';

import app from './app';
import socketio from 'socket.io';

/**
 * Normalize a port into a number, string, or false.
 */

const userSockets = [];

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || 3001);
const sPort = normalizePort(process.env.SPORT || 3000);
// app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// // HTTPS Proxy server
const server = http.createServer(
  app
  // function (req, res) {
  //   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  //   res.end();
  // }
);

const options = {
  key: fs.readFileSync(resolve('./cert/server.key')),
  cert: fs.readFileSync(resolve('./cert/server.crt'))
};

const sServer = https.createServer(options, app);

// Sockets
const io = socketio.listen(sServer);

io.on('connection', socket => {
  socket.on('user', user => {
    console.log('Connected: ' + user);
    const newUserSocket = {
      'user': user,
      'socket': socket,
      'id': socket.handshake.address
    };

    userSockets.push(newUserSocket);
  });

  socket.on('disconnect', ()=> {
      for (let i = 0; i < userSockets.length; i++) {
        if (userSockets[i].socket == socket) {
          console.log("Disconnected: " + userSockets[i].user);
          userSockets.splice(i, 1);
        }
      }
    });
});

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */
console.log('Server is running!');
server.listen(port);
sServer.listen(sPort);
server.on('error', onError);
server.on('listening', onListening);

export const getConnected = function () {
  return userSockets;
};
