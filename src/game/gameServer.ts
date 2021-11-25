import * as pc from 'playcanvas';
import socketio from 'socket.io';
import { Client } from '../client/client';
import { PlayCanvas } from '../playcanvas/playcanvas';
import { ServerOnline } from '../server/serverOnline';
import { Game } from "./game";


export class GameServer extends Game {


    constructor(io: socketio.Server) {
        super();

        io.on("connection", (socket) => {
            console.log(socket.id)

            const client = new Client(socket);

            const server = this.mainServer as ServerOnline;
            server.handleClientConnection(client);
        })

        
        setInterval(() => {
            this.update(0.016);
        }, 16)
    }

    public start() {
        super.start();

        const server = this.createServer('server1');
        server.worlds[0].generateBaseWorld();
    }

    public createServer(id: string): ServerOnline {
        const server = new ServerOnline(this)
        return this.addServer(server) as ServerOnline;
    }
}