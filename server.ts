import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import { MasterServer } from './src/server/masterServer';

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

server.listen(port, "127.0.0.1", () => console.log(`Express web server started: http://localhost:${port}`));

const masterServer = new MasterServer(io);
const server1 = masterServer.createServer();
server1.game.updateInterval = 30;
server1.game.fixTime = 1;

/*
var os = require('os-utils');


setInterval(() => {
  os.cpuUsage(function(v){
      console.log( 'CPU Usage (%): ' + v );
  });
}, 1000)
*/

