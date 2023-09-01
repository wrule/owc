"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const path_1 = __importDefault(require("path"));
const webPath = 'www';
function socketServer(server) {
    let best = { value: -Infinity, params: undefined };
    let iterations = 0;
    let optimizers = 0;
    const io = new socket_io_1.default.Server(server);
    io.on('connection', (client) => {
        io.emit('best', best);
        io.emit('iterations', iterations);
        io.emit('optimizers', optimizers);
        client.on('best', (newBest) => {
            if (newBest.value > best.value) {
                best = newBest;
                io.emit('best', best);
            }
        });
        client.on('iterations', (change) => {
            iterations += change;
            io.emit('iterations', iterations);
        });
        client.on('optimizers', (change) => {
            optimizers += change;
            io.emit('optimizers', optimizers);
        });
    });
    return io;
}
function main() {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    socketServer(server);
    app.use(express_1.default.static(path_1.default.resolve(webPath)));
    app.get('*', (req, res) => res.sendFile(path_1.default.resolve(webPath, 'index.html')));
    server.listen(9999);
}
main();
//# sourceMappingURL=dev.js.map