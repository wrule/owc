import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';
import path from 'path';

const webPath = 'www';

interface Best {
  value: number;
  params: any;
}

function socketServer(server: http.Server) {
  let best: Best = { value: -Infinity, params: undefined };
  let iterations = 0;
  let optimizers = 0;
  const io = new SocketIO.Server(server);
  io.on('connection', (client) => {
    client.on('best', (newBest: Best) => {
      if (newBest.value > best.value) {
        best = newBest;
        io.emit('best', best);
      }
    });
    client.on('iterations', (change: number) => {
      iterations += change;
      io.emit('iterations', iterations);
    });
    client.on('optimizers', (change: number) => {
      optimizers += change;
      io.emit('optimizers', optimizers);
    });
  });
  return io;
}

function main() {
  const app = express();
  const server = http.createServer(app);
  socketServer(server);
  app.use(express.static(path.resolve(webPath)));
  app.get('*', (req, res) => res.sendFile(path.resolve(webPath, 'index.html')));
  server.listen(9999);
}

main();
