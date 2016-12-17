/* eslint-disable no-console */

import debug from 'debug';
import http from 'http';

import app from './app';
import socketio from 'socket.io';

/**
 * Normalize a port into a number, string, or false.
 */

const userSocket = [];

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
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

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

const server = http.createServer(app);
const io = socketio(server);

io.on('connection',
  (socket) => {

    socket.on('user', function(msg){
      const newUserSocket = {
        "user": msg,
        "socket": socket
      }
      userSocket.push(newUserSocket);
      console.log("blabla");
      console.log((userSocket));
    });

    socket.on('disconnect',
      ()=> {
        for(var i = 0; i < userSocket.length; i++) {
          if(userSocket[i].socket == socket) {
            works.splice(i, 1);
          }
        }
        console.log(userSocket);
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
server.on('error', onError);
server.on('listening', onListening);

export const getConnected = function () {
  return userSocket;
};
