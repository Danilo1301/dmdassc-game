import Matter from "matter-js";
import * as pc from "playcanvas";
import { Component } from "./component/component";
import { Entity } from "./entity/entity";
import { Game } from "./game";
import { EventEmitter } from "./eventEmitter";
import { WorldEvent } from "./worldEvent";
import { Gameface } from "../client/gameface";
import { IPacketData_ComponentEvent, PacketType } from "./packet";
import { Client } from "../server/client";
import { EntityPlayer } from "./entity/entityPlayer";
import { EntityChar } from "./entity/entityChar";
import { NPCBehaviourComponent } from "./component/npcBehaviourComponent";


interface IWorldMatter {
    engine?: Matter.Engine
    world?: Matter.World
    runner?: Matter.Runner
}

export enum WorldSyncType {
    SINGLEPLAYER,
    CLIENT,
    HOST
}

export class World {
    public events: EventEmitter = new EventEmitter();

    public syncType: WorldSyncType = WorldSyncType.SINGLEPLAYER;
    
    public matter: IWorldMatter = {}
    public get entities() { return this._entities };
    public get game() { return this._game; };
    
    private _entities: Entity[] = [];
    private _game: Game;

    constructor(game: Game) {
        this._game = game;
        
        this.events.on(WorldEvent.COMPONENT_EVENT, (component: Component, event: string, broadcast: boolean, data: any, fromClient?: Client) => {
            //console.log(`[world] Component event: ${event} (${fromClient ? "has client" : "no client"})`)

            if(this.syncType == WorldSyncType.CLIENT) {

                const packetData: IPacketData_ComponentEvent = {
                    entity: component.entity.id,
                    component: this.game.entityFactory.getIndexOfComponent(component),
                    event: event,
                    data: data
                }
                
                Gameface.Instance.network.sendPacket(PacketType.COMPONENT_EVENT, packetData);

                
                console.log("sent to server")

            } else {

                if(fromClient) {

                    const packetData: IPacketData_ComponentEvent = {
                        entity: component.entity.id,
                        component: this.game.entityFactory.getIndexOfComponent(component),
                        event: event,
                        data: data
                    }
                    
                    fromClient.sendPacket(PacketType.COMPONENT_EVENT, packetData);
                }

                component.onReceiveComponentEvent.apply(component, [event, data, fromClient]);
            }
        })
    }

    public init() {
        console.log(`[world] init`);

        try {
            window['world'] = this;
        } catch(e) {

        }

        this.initMatterWorld();

        /*
        var bb = new ByteBuffer();
        bb.writeString("ayo");
        bb.flip();

        console.log(bb.toBuffer())

        console.log(bb.readString(2)+" from ByteBuffer.js");
        */
    }

    private testAttach(dt: number) {
        
    }


    public preupdate(dt: number) {
        //  this.testAttach(dt);

        for(const entity of this.entities) {
          entity.preupdate(dt)
        }
    }

    public update(dt: number) {
        this.testAttach(dt);
        for(const entity of this.entities) {
          entity.update(dt)
        }
    }

    public postupdate(dt: number) {
        //this.testAttach(dt);
        for(const entity of this.entities) {
          entity.postupdate(dt)
        }
    }

    private initMatterWorld() {
        const engine = this.matter.engine = Matter.Engine.create();
        const world = this.matter.world = engine.world;
        const runner = this.matter.runner = Matter.Runner.create();
        
        engine.gravity.x = 0;
        engine.gravity.y = 0;

        Matter.Runner.run(runner, engine);

        Matter.Events.on(runner, "beforeUpdate", () => {
            this.preupdate(engine.timing.lastDelta * 0.001);
        })

        Matter.Events.on(runner, "afterUpdate", () => {
            this.update(engine.timing.lastDelta * 0.001);
            this.postupdate(engine.timing.lastDelta * 0.001);
        })
    }

    private spawnEntities() {
        
        for (let i = 0; i < 50; i++) {

            this.spawnNpc()

        }

        console.log(this.entities.length)

    }

    public spawnNpc() {
        const npc = this.spawnEntity(EntityChar);
        npc.addComponent(new NPCBehaviourComponent());
        return npc;
    }

    public generateWorld() {
        console.log(`[world] generate world`);

        this.spawnEntities();
    }

    
    
    public spawnEntity(c: typeof Entity) {
        const entity = new c(this);

        return this.addEntity(entity);
    }

    public addEntity(entity: Entity) {
        //console.log(`[world] add entity ${entity.constructor.name}`);
        
        this._entities.push(entity);
        entity.init();
        return entity;
    }

    public getEntity(id: string) {
        for (const entity of this.entities) {
            if(entity.id == id) return entity;
        }
    }
}