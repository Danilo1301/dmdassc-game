import { Client } from '@game/client/Client';
import { FollowComponent } from '@game/entity/component/FollowComponent';
import { WeaponComponent } from '@game/entity/component/WeaponComponent';
import { EntityBulletTracer } from '@game/entity/EntityBulletTracer';
import { EntityObject } from '@game/entity/EntityObject';
import { EntityPlayer } from '@game/entity/EntityPlayer';
import { EntityVehicle } from '@game/entity/EntityVehicle';
import { EntityWeapon } from '@game/entity/EntityWeapon';
import { EntityFactory } from '@game/entityFactory/EntityFactory';
import { World } from '@game/world/World';
import { v4 as uuidv4 } from 'uuid';

export class Server {

    public isHost: boolean = true;
    public isOnline: boolean = false;
    private _id: string;
    private _worlds = new Phaser.Structs.Map<string, World>([]);
    private _clients = new Phaser.Structs.Map<string, Client>([]);
    private _entityFactory: EntityFactory

    constructor() {
        this._id = uuidv4();
        this._entityFactory = new EntityFactory();
        this._entityFactory.registerEntity('EntityPlayer', EntityPlayer);
        this._entityFactory.registerEntity('EntityBulletTracer', EntityBulletTracer);
        this._entityFactory.registerEntity('EntityWeapon', EntityWeapon);
        this._entityFactory.registerEntity('EntityObject', EntityObject);
        this._entityFactory.registerEntity('EntityVehicle', EntityVehicle);

        this._entityFactory.registerComponent('WeaponComponent', WeaponComponent);
        this._entityFactory.registerComponent('FollowComponent', FollowComponent);

        /*
        this._entityFactory.registerEntity('EntityVehicle', EntityVehicle);
        this._entityFactory.registerEntity('EntityProjectile', EntityProjectile);
        this._entityFactory.registerEntity('EntityWeapon', EntityWeapon);
        */

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

        const entity = this.worlds[0].spawnPlayer();

        

        client.setPlayer(entity);
        
        callback?.(true);
    }

    public handleClientDisconnect(client: Client) {
        const world = client.player.world;
        world.removeEntity(client.player);

        this._clients.delete(client.id);
    }
}