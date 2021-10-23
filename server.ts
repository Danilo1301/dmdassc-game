import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

require('jsdom-global')();

import { GameServer } from './src/scripts/game/gameServer';

const isDevelopment = (process.env.NODE_ENV || "development").trim() === 'development';
const port = 3000;

const io: socketio.Server = new socketio.Server();

console.log("server.ts | (ignoring)isDevelopment=", isDevelopment);

const app: express.Application = express();
const server: http.Server = http.createServer(app);

io.attach(server, {
    path: '/socket',
    cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, "..", "dist")));

server.listen(port, () => console.log(`Express web server started: http://localhost:${port}`));


function setupGame() {
    const game = new GameServer(io.of("/api/game"));
    game.start();
}

setupGame();





