
import * as pc from 'playcanvas'
import { Server } from '../server/server';

export class Game {
    private _isServer: boolean = false;
    private _servers = new Map<string, Server>();

    public get isServer() { return this._isServer; }
    public get servers() { return Array.from(this._servers.values()); }
    public get mainServer() { return this.servers[0]; }

    constructor(isServer?: boolean) {
        this._isServer = isServer === true;
    }

    public start() {
        console.log(`[Game] start; isServer =`, this.isServer);
    }

    public createServer(id: string) {
        const server = new Server(this);
        this._servers.set(id, server);
    }

    protected update(dt: number) {
        this.servers.map(server => server.update(dt));
    }
}