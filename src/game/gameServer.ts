import socketio from 'socket.io';
import { Client } from "../client/client";
import { Game } from "./game";

export class GameServer extends Game {
    private _clients = new Map<string, Client>();
    
    public get clients() { return Array.from(this._clients.values()); }

    constructor(io: socketio.Server) {
        super(true);

        io.on('connection', socket => this.onSocketConnect(socket));

    }

    public start() {
        super.start();
        this.startLoop();
    }

    private onSocketConnect(socket: socketio.Socket) { 
        const client = new Client(this, socket);
        this._clients.set(client.id, client);
        client.onConnect();
    }

    protected update(dt: number) {
        super.update(dt);

        this.clients.map(client => client.update(dt));
    }

    private startLoop() {
        let lastUpdate = Date.now();
        const myInterval = setInterval(tick, 0);
        const self = this;


        function tick() {
            var now = Date.now();
            var dt = now - lastUpdate;
            lastUpdate = now;

            self.update(dt / 1000);

        }
    }
}