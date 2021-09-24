import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

const isDevelopment = (process.env.NODE_ENV || "development").trim() === 'development';
const port = 3000;

console.log("server.ts | (ignoring)isDevelopment=", isDevelopment);

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

io.attach(server, {
    path: '/socket',
    cors: { origin: '*' }
});

app.use('/static', express.static(path.join(__dirname, "..", "static")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "game", "index.html")) );

server.listen(port, () => console.log(`Express web server started: http://localhost:${port}`));

//

console.log("Starting geckos...")

import '@geckos.io/phaser-on-nodejs'
global['phaserOnNodeFPS'] = 30

//

console.log("Starting GameServer...")

import { GameServer } from '@game/game/GameServer'

var game = new GameServer(io.of("/api/game"))
game.start()