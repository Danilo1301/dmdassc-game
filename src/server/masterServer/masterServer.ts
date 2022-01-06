
import socketio from 'socket.io';
import { Client } from '../client/client';
import { Server } from '../server/server';

var request = require('request');


export class MasterServer {
    public static Instance: MasterServer;

    public get servers() { return Array.from(this._servers.values()); }

    private _servers = new Map<string, Server>();
    private _clients = new Map<string, Client>();

    constructor(io: socketio.Server) {
        MasterServer.Instance = this;

        io.on("connection", this.onSocketConnect.bind(this));
 
        let lastTick = 0;
        setInterval(() => {
            let now = Date.now();
            let dt = (now - (lastTick == 0 ? now : lastTick)) / 1000;
            lastTick = now;

            this.update(dt);
        }, 16)
    }

    public onSocketConnect(socket: socketio.Socket) {
        let client: Client | undefined; //this.findClientByAddress(address);

        if(!client) client = this.createClient(socket);
        
        client.setSocket(socket)
    }

    public createClient(socket: socketio.Socket) {
        const client = new Client();

        this._clients.set(client.id, client)

        return client
    }

    public findClientByAddress(address: string) {
        for (const c of Array.from(this._clients.values())) {
            if(c.addressList.includes(address)) {
                return c
            }
        }
    }

    public static postGameLog(address: string, message: string) {
        let url = "https://dmdassc.glitch.me/gamelog/log"

        if(address.includes("127.0.0.1")) {
            url = "http://127.0.0.1:3000/gamelog/log";
        }

        const data = {
            service: 'dmdassc-game',
            address: address,
            message: message
        }
        
        request.post(
            url,
            { json: data },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        ); 
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