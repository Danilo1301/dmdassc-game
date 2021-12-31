
import socketio from 'socket.io';
import { Client } from '../client/client';
import { Server } from '../server/server';

export class MasterServer {
    public static Instance: MasterServer;

    public get servers() { return Array.from(this._servers.values()); }

    private _servers = new Map<string, Server>();

    constructor(io: socketio.Server) {
        MasterServer.Instance = this;

        io.on("connection", this.onSocketConnect);

        setInterval(() => {
            this.update(0.016);
        }, 16)
    }

    public onSocketConnect(socket: socketio.Socket) {
        const client = new Client();
        client.setSocket(socket);

        console.log("client")
    }

    public createServer() {
        const server = new Server();
        this._servers.set(server.id, server);
        server.start();
    }

    public update(dt: number) {
        this.servers.map(server => server.update(dt));
    }
}