import { Client } from "@game/client/Client";
import { Game } from "@game/game/Game";
import { SceneManager } from "@game/sceneManager/SceneManager";
import socketio from 'socket.io';

export class GameServer extends Game {
    
    constructor(io: socketio.Namespace) {
        super();

        io.on("connection", this.onSocketConnect.bind(this))
    }

    public start() {
        super.start();

        console.log(`[GameServer] Start`);

        


        const server = this.createServer();
        const world = server.createWorld('world1');

        world.events.on('ready', () => {
            world.setupDefaultWorld();
        })

        world.init();
        
    }

    private onSocketConnect(socket: socketio.Socket) {
        console.log(`[GameServer] New socket connection (${socket.id})`);

        const client = new Client(this, socket);
    }
}