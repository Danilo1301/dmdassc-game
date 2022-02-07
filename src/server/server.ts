import { v4 as uuidv4 } from 'uuid';
import { Client } from './client';
import { Game } from '../shared/game';
import { WorldEvent } from '../shared/worldEvent';
import { WorldSyncType } from '../shared/world';
import { Component } from '../shared/component/component';
import { IPacketData_ComponentEvent, IPacketData_EntityData, PacketType } from '../shared/packet';
import { EntityPlayer } from '../shared/entity/entityPlayer';
import { SyncComponent, SyncType } from '../shared/component/syncComponent';

export class Server {
    public get id() { return this._id; }
    public get game() { return this._game; }
    public get clients() { return Array.from(this._clients.values()); }

    private _id: string = uuidv4();
    private _game: Game;
    private _clients = new Map<string, Client>();

    private _sendEntityDataTime: number = 0;
    private _sendEntityDataIntervalMs: number = 200;

    constructor() {
        this._game = new Game();
    }

    public start() {
        const game = this.game;
        game.start();
        
        const world = game.createWorld('world');
        world.syncType = WorldSyncType.HOST;
        world.init();
        world.generateWorld();


        world.events.on(WorldEvent.COMPONENT_EVENT, (component: Component, event: string, broadcast: boolean, data: any, fromClient?: Client) => {
            if(!broadcast) return;

            //console.log(`[world] Component BROADCAST event: ${event} (${fromClient ? "has client" : "no client"})`);


            for (const client of this.clients) {

   
                if(client == fromClient) continue;
                if(!client.isEntityStreamed(component.entity)) continue;

        

                client.sendPacket<IPacketData_ComponentEvent>(PacketType.COMPONENT_EVENT, {
                    entity: component.entity.id,
                    component: this.game.entityFactory.getIndexOfComponent(component),
                    event: event,
                    data: data
                });
            }

        });

    }

    public update(dt: number) {
        //this.game.update(dt);
        this.clients.map(client => client.update(dt));


        this._sendEntityDataTime += dt;
        if(this._sendEntityDataTime >= this._sendEntityDataIntervalMs/1000) {
            this._sendEntityDataTime = 0;
            this.sendEntitiesData();
        }
    }

    /*
    100 entities
    sending every 200ms

    1 player:
    18 - 16 - 16 - 17

    0 player:
    8 - 9 - 7 - 8

    -----

    100 entities
    sending every 200ms
    data watch 

    1 player:
    18 - 16 - 17 - 26? - 19 - 20

    0 player:
    10 - 11 - 10 - 11

    5 player:
    50 - 45 - 47
    
    */
    public sendEntitiesData() {
        for (const world of this.game.worlds) {
            
            
            for (const entity of world.entities) {
                
                const fullData = entity.getFullData();
                const changedData = entity.dataWatcher.setData(fullData);

                if(changedData == undefined) continue;
       
                for (const client of this.clients) {
                    //console.log("sent")

                    client.sendPacket<IPacketData_EntityData>(PacketType.ENTITY_DATA, {
                        id: entity.id,
                        d: changedData
                    });

                    
                }

            }

        }

        //console.log("sending")


    }

    public onClientJoin(client: Client) {
        console.log("client joined")

        this._clients.set(client.id, client);

        const world = this.game.worlds[0];

        const player = world.spawnEntity(EntityPlayer);
        const syncComponent = player.addComponent(new SyncComponent());
        syncComponent.positionLerp = 0.3;
        syncComponent.syncType = SyncType.SERVER_SYNC;

        client.checkStreamedEntities();
        client.setPlayer(player);
    }

    public onClientLeave(client: Client) {
        
    }
}


