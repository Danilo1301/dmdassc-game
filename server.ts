import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import { Game } from './src/game/game';
import { PacketType } from './src/network/network';
import ByteBuffer from 'bytebuffer';
import { Packet } from './src/packet/packet';
import { MasterServer } from './src/masterServer/materServer';

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


const masterServer = new MasterServer(io);
const server1 = masterServer.createServer();


