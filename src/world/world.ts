import Matter from "matter-js";
import { InputHandlerComponent } from "../component/inputHandlerComponent";
import { Entity } from "../entity/entity";
import { EntityBuilding } from "../entity/entityBuilding";
import { EntityObject } from "../entity/entityObject";
import { EntityPlayer } from "../entity/entityPlayer";
import { EntityVehicle } from "../entity/entityVehicle";
import { Server } from "../server/server";

export interface IWorldSpawnOptions {
    id?: string
}

export class World {
    private _server: Server;
    private _entities = new Map<string, Entity>();
    private _engine: Matter.Engine;
    private _matterWorld: Matter.World;
    private _runner: Matter.Runner;

    public get server() { return this._server };
    public get entities() { return Array.from(this._entities.values()) };
    public get engine() { return this._engine };
    public get matterWorld() { return this._matterWorld };

    constructor(server: Server) {
        this._server = server;
    }

    public init() {
        console.log(`[world] init`);

        this.initMatter();
        
        this.generateBuldings();
    }

    public generateBaseWorld() {
        for (let i = 0; i < 1; i++) {
            this.spawnPlayer();
        }
        
        for (let i = 0; i < 4; i++) {
            this.spawnObject();
        }

        for (let i = 0; i < 1; i++) {
            this.spawnVehicle();
        }

        
    }

    private generateBuldings() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const b = this.spawnBuilding();

            b.position.set(
                (x-2) * 10 * 6,
                (y-2) * 10 * 6,
            )
            }
            
        }
    }
    
    private initMatter() {
        const engine = this._engine = Matter.Engine.create();
        const world = this._matterWorld = engine.world;
        const runner = this._runner = Matter.Runner.create();
        
        engine.gravity.x = 0;
        engine.gravity.y = 0;

        Matter.Runner.run(runner, engine);
    }

    public spawnPlayer() {
        const entity = new EntityPlayer(this);
        this.addEntity(entity);
        return entity;
    }

    public spawnObject() {
        const entity = new EntityObject(this);
        this.addEntity(entity);
        return entity;
    }

    public spawnVehicle() {
        const entity = new EntityVehicle(this);
        this.addEntity(entity);
        return entity;
    }

    public spawnBuilding() {
        const entity = new EntityBuilding(this);
        this.addEntity(entity);
        return entity;
    }

    public update(dt: number) {
        this.entities.map(entity => entity.update(dt))
    }

    public postupdate(dt: number) {
        this.entities.map(entity => entity.postupdate(dt))
    }

    public getEntity(id: string) {
        return this._entities.get(id)!;
    }

    public hasEntity(id: string) {
        return this._entities.has(id);
    }

    public addEntity(entity: Entity) {
        this._entities.set(entity.id, entity);
        entity.init();
        return entity;
    }
}