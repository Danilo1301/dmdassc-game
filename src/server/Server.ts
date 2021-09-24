import { Client } from '@game/client/Client';
import { World } from '@game/world/World';
import { v4 as uuidv4 } from 'uuid';

export class Server {

    private _id: string;
    private _worlds = new Phaser.Structs.Map<string, World>([]);
    private _clients = new Phaser.Structs.Map<string, Client>([]);

    constructor() {
        this._id = uuidv4();

        console.log(`[Server] Created`);
    }

    public get id() { return this._id; }
    public get worlds() { return this._worlds.values(); }
    public get clients() { return this._clients.values(); }


    public update(delta: number) {
        //console.log(`[Server] Update`);

        //this.clients.map(client => client.update(delta));
    }

    public createWorld(id: string) {
        const world = new World(this);
        world.id = id;
        this._worlds.set(world.id, world);
        return world;
    }

    public handleClientConnection(client: Client, callback?: (success: boolean) => void) {
        this._clients.set(client.id, client);

        const entity = this.worlds[0].createPlayer();
        entity.position.canLerp = true;
        entity.position.lerpAmount = 0.7;

        client.entity = entity;

        callback?.(true);
    }
}