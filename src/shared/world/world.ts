import Matter from "matter-js";
import * as pc from "playcanvas";
import { InputHandlerComponent } from "../component/inputHandlerComponent";
import { NPCBehaviourComponent } from "../component/npcBehaviourComponent";
import { TestCollisionComponent } from "../component/testCollisionComponent";
import { EntityBuilding } from "../entity/building/entityBuilding";
import { Entity } from "../entity/entity";
import { EntityPlayer } from "../entity/player/entityPlayer";
import { EntityVehicle } from "../entity/vehicle/entityVehicle";
import { Game } from "../game/game";

interface IWorldMatter {
    engine?: Matter.Engine
    world?: Matter.World
    runner?: Matter.Runner
}

export class World {
    public matter: IWorldMatter = {}
    public get entities() { return Array.from(this._entities.values()) };
    public get game() { return this._game; };
    
    private _entities = new Map<string, Entity>();
    private _game: Game;

    constructor(game: Game) {
        this._game = game;
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

    public update(dt: number) {
        this.entities.map(entity => entity.update(dt));
    }

    private initMatterWorld() {
        const engine = this.matter.engine = Matter.Engine.create();
        const world = this.matter.world = engine.world;
        const runner = this.matter.runner = Matter.Runner.create();
        
        engine.gravity.x = 0;
        engine.gravity.y = 0;

        Matter.Runner.run(runner, engine);
    }

    public generateWorld() {
        console.log(`[world] generate world`);

        
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 6; x++) {
                const building = this.spawnEntity(EntityBuilding);
                building.transform.setPosition((x-3) * 600, (y-3) * 600)
       
            }
        }

        for (let i = 0; i < 2; i++) {
            const vehicle = this.spawnEntity(EntityVehicle);
            vehicle.transform.setPosition(0, -80)
        }
        
        for (let i = 0; i < 4; i++) {
            const npc = this.spawnEntity(EntityPlayer);
            npc.addComponent(new NPCBehaviourComponent())
            //vehicle.transform.setPosition(0, -80)
        }
        


        //vehicle2.data.mergeData({position: {x: 160, c: {a: 123}}})

        /*
        setInterval(() => {
            vehicle2.transform.setVelocity(0.1, 3)
            vehicle2.transform.setAngularVelocity(0.2)

            if(vehicle2.transform.getPosition().distance(new pc.Vec2()) > 400) {
                vehicle2.transform.setPosition(0, 0);
            }
        }, 500)

        console.log(vehicle2.transform.angle)
        */
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
        console.log(`[world] add entity ${entity.constructor.name}`);
        
        this._entities.set(entity.id, entity);
        entity.init();
        return entity;
    }
}