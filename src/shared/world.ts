import Matter from "matter-js";
import * as pc from "playcanvas";
import { Component } from "./component/component";
import { InputHandlerComponent } from "./component/inputHandlerComponent";
import { NPCBehaviourComponent } from "./component/npcBehaviourComponent";
import { TestCollisionComponent } from "./component/testCollisionComponent";
import { EntityBuilding } from "./entity/entityBuilding";
import { Entity } from "./entity/entity";
import { EntityPlayer } from "./entity/entityPlayer";
import { EntityVehicle } from "./entity/entityVehicle";
import { Game } from "./game";
import { EntityWeapon } from "./entity/entityWeapon";
import { WeaponComponent } from "./component/weaponComponent";
import { EventEmitter } from "./eventEmitter";
import { WorldEvent } from "./worldEvent";
import { Gameface } from "../client/gameface";
import { IPacketData_ComponentEvent, PacketType } from "./packet";
import { Client } from "../server/client";
import { EquipItemComponent } from "./component/equipItemComponent";


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
    public get entities() { return Array.from(this._entities.values()) };
    public get game() { return this._game; };
    
    private _entities = new Map<string, Entity>();
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
        this.entities.map(entity => {
            entity.updateAttachPosition();
        });
    }


    public preupdate(dt: number) {
        //  this.testAttach(dt);
        this.entities.map(entity => entity.preupdate(dt));
    }

    public update(dt: number) {
        this.testAttach(dt);
        this.entities.map(entity => entity.update(dt));
    }

    public postupdate(dt: number) {
        //this.testAttach(dt);
        this.entities.map(entity => entity.postupdate(dt));
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
        const keepincenter = (entity: Entity) => {

            setInterval(() => {

                if(entity.transform.getPosition().distance(new pc.Vec2()) > 700) {
                    entity.transform.setPosition(0, 0);
                }
                
            }, 2000)

        }
        
        
        

        for (let i = 0; i < 2; i++) {
            const vehicle = this.spawnEntity(EntityVehicle);
            vehicle.transform.setPosition(0, -80)
            
            keepincenter(vehicle);
        }
        
        for (let i = 0; i < 8; i++) {
            const npc = this.spawnEntity(EntityPlayer);
            npc.addComponent(new NPCBehaviourComponent())
            //vehicle.transform.setPosition(0, -80)

            if(i == 0 || i == 1) {

                setInterval(() => {
                    npc.getComponent(EquipItemComponent).tryUse();
                }, 500)

                //const weapon = this.spawnEntity(EntityWeapon);

                //weapon.attachToEntity(npc);

            }
        }
        
        for (let i = 0; i < 2; i++) {
            const wpn = this.spawnEntity(EntityWeapon);
            //wpn.getComponent(WeaponComponent).enabled = true;

            keepincenter(wpn);
            //vehicle.transform.setPosition(0, -80)
        }


        //
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 6; x++) {
                const building = this.spawnEntity(EntityBuilding);
                building.transform.setPosition((x-3) * 600, (y-3) * 600)
            }
        }
    }

    public generateWorld() {
        
        

        console.log(`[world] generate world`);

        const npc = this.spawnEntity(EntityPlayer);
        npc.addComponent(new NPCBehaviourComponent())
           
        const weapon = this.spawnEntity(EntityWeapon);

        weapon.attachToEntity(npc);

        const car = this.spawnEntity(EntityVehicle);
        const weapon2 = this.spawnEntity(EntityWeapon);
        weapon2.attachToEntity(car);

        this.spawnEntities();

    }

    
    
    public spawnEntity(c: typeof Entity, options?) {
        const entity = new c(this);

        if(options) {
            if(options.id) entity.setId(options.id);

            if(options.dontAdd) return entity;
        }
        
        
        return this.addEntity(entity);
    }

    public hasEntity(id: string) {
        return this._entities.has(id);
    }

    public getEntity(id: string) {
        return this._entities.get(id);
    }

    public removeEntity(entity: Entity) {
        entity.destroy();
        this._entities.delete(entity.id);
    }

    public addEntity(entity: Entity) {
        //console.log(`[world] add entity ${entity.constructor.name}`);
        
        this._entities.set(entity.id, entity);
        entity.init();
        return entity;
    }
}