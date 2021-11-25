import { Server } from "../server/server";

export class Game {
    private _servers = new Map<string, Server>();

    public isClient: boolean = false;
    public get servers() { return Array.from(this._servers.values()); }
    public get mainServer() { return this.servers[0]; }

    public start() {}

    public update(dt: number) {
        this.servers.map(server => server.update(dt));
    }

    public createServer(id: string) {
        const server = new Server(this);
        server.id = id;
        return this.addServer(server);;
    }

    public addServer(server: Server) {
        this._servers.set(server.id, server);
        server.init();
        return server;
    }
}