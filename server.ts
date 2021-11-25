import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import { GameServer } from './src/game/gameServer';

const isDevelopment = (process.env.NODE_ENV || "development").trim() === 'development';
const port = 3000;
const io: socketio.Server = new socketio.Server()
const app: express.Application = express();
const server: http.Server = http.createServer(app);

console.log("server.ts | (ignoring)isDevelopment=", isDevelopment);

//path: '/socket',
io.attach(server, {cors: { origin: '*' }});

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => console.log(`Express web server started: http://localhost:${port}`));

const game = new GameServer(io);
game.start();
//game.createServer('server-s');


