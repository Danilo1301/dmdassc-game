import Phaser from 'phaser';
import { Server } from "@game/server/Server";

export class Game {
    
    private _servers = new Phaser.Structs.Map<string, Server>([]);

    public get servers() { return this._servers.values(); }

    public start() {
        console.log(`[Game] Start`);

        //change
        setInterval(() => this.updateServers(16), 16);
    }

    public createServer() {
        const server = new Server();
        this._servers.set(server.id, server);
        return server;
    }

    public getServer(id: string) {
        return this._servers.get(id);
    }
 
    protected updateServers(delta: number) {
        for (const server of this.servers) server.update(delta);
    }
}