import { Client } from '@game/client/Client';
import { EntityObject } from '@game/entities/object/EntityObject';
import { EntityPlayer } from '@game/entities/player/EntityPlayer';
import { EntityVehicle } from '@game/entities/vehicle/EntityVehicle';
import { EntityFactory } from '@game/entityFactory/EntityFactory';
import { World } from '@game/world/World';
import { v4 as uuidv4 } from 'uuid';

export class Server {

    private _id: string;
    private _worlds = new Phaser.Structs.Map<string, World>([]);
    private _clients = new Phaser.Structs.Map<string, Client>([]);
    private _entityFactory: EntityFactory

    constructor() {
        this._id = uuidv4();
        this._entityFactory = new EntityFactory();
        this._entityFactory.registerEntity('EntityPlayer', EntityPlayer);
        this._entityFactory.registerEntity('EntityObject', EntityObject);
        this._entityFactory.registerEntity('EntityVehicle', EntityVehicle);

        console.log(`[Server] Created`);
    }

    public get id() { return this._id; }
    public get worlds() { return this._worlds.values(); }
    public get clients() { return this._clients.values(); }
    public get entityFactory() { return this._entityFactory; }


    public update(delta: number) {
        //console.log(`[Server] Update`);

        //this.clients.map(client => client.update(delta));

        //this.worlds.map(map => map.update(delta));
    }

    public createWorld(id: string) {
        const world = new World(this);
        world.id = id;
        this._worlds.set(world.id, world);
        return world;
    }

    public handleClientConnection(client: Client, callback?: (success: boolean) => void) {
        this._clients.set(client.id, client);

        const entity = this.worlds[0].createVehicle();
        entity.position.canLerp = true;
        entity.position.lerpAmount = 0.8;

        client.entity = entity;

        callback?.(true);
    }
}