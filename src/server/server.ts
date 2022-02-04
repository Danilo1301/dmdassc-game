import { v4 as uuidv4 } from 'uuid';
import { Client } from './client';
import { SyncComponent, SyncType } from '../shared/component/syncComponent';
import { EntityPlayer } from '../shared/entity/entityPlayer';
import { Game } from '../shared/game';

export class Server {
    public get id() { return this._id; }
    public get game() { return this._game; }
    public get clients() { return Array.from(this._clients.values()); }

    private _id: string = uuidv4();
    private _game: Game;
    private _clients = new Map<string, Client>();

    private _sendEntityDataTime: number = 0;
    private _sendEntityDataIntervalMs: number = 30;

    constructor() {
        this._game = new Game();
    }

    public start() {
        const game = this.game;
        game.start();
        
        const world = game.createWorld('world');
        world.init();
        world.generateWorld();
    }

    public update(dt: number) {
        this.game.update(dt);
        this.clients.map(client => client.update(dt));


        this._sendEntityDataTime += dt;
        if(this._sendEntityDataTime >= this._sendEntityDataIntervalMs/1000) {
            this._sendEntityDataTime = 0;
            this.sendEntitiesData();
        }
    }

    public sendEntitiesData() {

        //console.log("sending")

        for (const world of this.game.worlds) {
            
            for (const entity of world.entities) {
            
                if(!entity.canSync) continue;

                if(Date.now() - entity.lastSync < entity.syncInterval) continue;
                entity.lastSync = Date.now();

                const data = entity.data.getChangedData();

                if(data == undefined) continue;

                //console.log(entity.id, data);
                entity.data.clearChangedData();

                for (const client of this.clients) {
                    if(!client.isEntityStreamed(entity)) continue;

                    client.sendEntityData(entity, data);
                }

            }

        }

        

        

    }

    public onClientJoin(client: Client) {
        console.log("client joined")

        this._clients.set(client.id, client);

        const world = this.game.worlds[0];

        const player = world.spawnEntity(EntityPlayer);
        const syncComponent = player.addComponent(new SyncComponent());
        syncComponent.syncType = SyncType.SERVER_SYNC;
        syncComponent.positionLerp = 0.8;

        client.checkStreamedEntities();
        client.setPlayer(player);
    }

    public onClientLeave(client: Client) {
        if(client.player) {
            client.player.world.removeEntity(client.player);
        }
    }
}


