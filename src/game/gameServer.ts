
import { Client } from "../client/client";
import { IPacket } from "../packet/packet";
import { Game } from "./game";

export class GameServer extends Game {
    private _clients = new Map<string, Client>();
    
    public get clients() { return Array.from(this._clients.values()); }

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        window['onSocketConnect'] = this.onSocketConnect.bind(this);
        window['onSocketDisconnect'] = this.onSocketDisconnect.bind(this);
        window['onReceiveSocketData'] = this.onReceiveSocketData.bind(this);
    }

    public start() {
        super.start();
    }

    protected update(dt: number) {
        super.update(dt);

        this.clients.map(client => client.update(dt));
    }

    private onSocketConnect(id: string) {
        console.log(`[GameServer] New socket connection ${id}`);

        const client = new Client(this, id);
        this._clients.set(client.id, client);

        client.onConnect();
    }

    private onSocketDisconnect(id: string, reason: string) {
        console.log(`[GameServer] Socket disconnect ${id}: ${reason}`);
    }

    private onReceiveSocketData(id: string, data: string) {
        const packet = JSON.parse(data) as IPacket;

        this._clients.get(id)!.onReceivePacket(packet);
    }

    public sendClientData(id: string, data: any) {
        const str = typeof data == 'string' ? data : JSON.stringify(data);

        //console.log(`[GameServer] Sending to ${id}: ${str}`);

        window['sendClientData'](id, str);
    }
}