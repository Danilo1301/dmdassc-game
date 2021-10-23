import socketio from 'socket.io';
import { Game } from "./game";
import { Client } from '../client/client';

export class GameServer extends Game {
    constructor(io: socketio.Namespace) {
        super();
  
        console.log(`[GameServer] Listening for socket clients...`);

        io.on("connection", this.onSocketConnect.bind(this))
    }

    public start() {
        super.start();
        
        const server = this.createServer('server1');
    }

    private onSocketConnect(socket: socketio.Socket) {
        console.log(`[GameServer] New socket connection (${socket.id})`);

        const client = new Client(this, socket);
    }
}