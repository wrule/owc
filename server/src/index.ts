import http from 'http';
import path from 'path';
import Express from 'express';
import SocketIO from 'socket.io';
import * as args from '@wrule/args';

interface Best {
  value: number;
  params: any;
}

function fillParams(params: any) {
  Object.entries(args.parse(process.argv)).forEach(([key, value]) => {
    if (!(key in params)) throw `unknown param ${key}`;
    params[key] = value;
  });
  console.log(`./${args.file_name(process.argv[1])} ${args.stringify(params)}`);
  console.log(params);
}

function socketServer(server: http.Server) {
  let best: Best = { value: -Infinity, params: undefined };
  let iterations = 0;
  let optimizers = 0;
  const io = new SocketIO.Server(server);
  io.on('connection', (client) => {
    io.emit('best', best);
    io.emit('iterations', iterations);
    io.emit('optimizers', optimizers);
    client.on('best', (newBest: Best) => {
      if (newBest.value >= best.value) {
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
  const params = { path: 'build', port: 9999 };
  fillParams(params);
  const app = Express();
  const server = http.createServer(app);
  socketServer(server);
  app.use(Express.static(path.resolve(params.path)));
  app.get('*', (req, res) => res.sendFile(path.resolve(params.path, 'index.html')));
  server.listen(params.port);
}

main();
