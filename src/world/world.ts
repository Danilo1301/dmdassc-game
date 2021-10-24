import CANNON from 'cannon'
import { Entity } from '../entity/entity';
import { Server } from "../server/server";

export class World {

    private _server: Server;
    private _dynamicWorld: CANNON.World;
    private _entities = new Map<string, Entity>();

    public get server() { return this._server };
    public get dynamicWorld() { return this._dynamicWorld };
    public get entities() { return Array.from(this._entities.values()) };

    constructor(server: Server) {
        this._server = server;

        this.setupDynamicWorld();
    }

    public update(dt: number) {
        var fixedTimeStep = 1.0 / 60.0; // seconds
        var maxSubSteps = 3;

        this.dynamicWorld.step(fixedTimeStep, dt, maxSubSteps);
    }

    public getEntity(id: string) {
        return this._entities.get(id)!;
    }

    public hasEntity(id: string) {
        return this._entities.has(id);
    }

    private setupDynamicWorld() {

        // Setup our world
        var world = this._dynamicWorld = new CANNON.World();
        world.gravity = new CANNON.Vec3(0, 0, -9.82) // m/s²

        const ground = this.spawnEntity(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(30, 30, 1), {mass: 0});
        ground.dontSync = true;
        
        
        

        //const box = this.spawnTestEntity(new CANNON.Vec3(0, 0, 4), new CANNON.Vec3(1, 1, 1), {mass: 200});
        //const box2 = this.spawnTestEntity(new CANNON.Vec3(0, 1, 8), new CANNON.Vec3(1, 1, 1), {mass: 200});
        
        setInterval(() => {

            //console.log("ground: " + this.printPosition(ground.getPosition()));
            //console.log("box: " + this.printPosition(box.getPosition()));

        }, 250)

        //setInterval(() => { this.spawnTestEntity(); }, 1000)
    }

    public spawnEntity(position?: CANNON.Vec3, halfExtends?: CANNON.Vec3, options?: CANNON.IBodyOptions, customId?: string) {

        options = options || {mass: 200};

        const body = this.createRectangleBody(position || new CANNON.Vec3(Math.random()*6-3, Math.random()*6-3, 3), halfExtends || new CANNON.Vec3(1, 1, 1), options);
        
        const entity = new Entity(this);
        entity.setBody(body)
        if(customId) entity.setId(customId);

        this._entities.set(entity.id, entity);

        return entity;
    }

    private printPosition(pos: CANNON.Vec3) {
        return `(${pos.x}, ${pos.y}, ${pos.z})`
    }

    public createRectangleBody(position: CANNON.Vec3, halfExtends: CANNON.Vec3, options?: CANNON.IBodyOptions) {
        
        const opt = options || {};

        opt.position = position;
     
        var shape = new CANNON.Box(halfExtends);
        var body = new CANNON.Body(opt);
        body.addShape(shape);

        this.dynamicWorld.addBody(body);

        return body; 
    }
}

/*
const entity = new pc.Entity(name);
entity.setPosition(position)
this.createRectangleAtEntity(entity, size, isDynamic, color);
app.root.addChild(entity);
*/