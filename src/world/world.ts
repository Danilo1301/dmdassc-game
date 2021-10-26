import CANNON from 'cannon'
import * as pc from 'playcanvas';
import { Entity } from '../entity/entity';
import { Server } from "../server/server";

export class World {

    private _server: Server;
    private _dynamicWorld: CANNON.World;
    private _entities = new Map<string, Entity>();

    public get server() { return this._server };
    public get dynamicWorld() { return this._dynamicWorld };
    public get entities() { return Array.from(this._entities.values()) };

    private _material_ground: CANNON.Material;
    private _material_test: CANNON.Material;
    
    constructor(server: Server) {
        this._server = server;

        this.setupDynamicWorld();
    }

    public update(dt: number) {
        var fixedTimeStep = 1.0 / 60.0; // seconds
        var maxSubSteps = 3;

        this.entities.map(entity => entity.update(dt));
        this.dynamicWorld.step(fixedTimeStep, dt, maxSubSteps);
    }

    public getEntity(id: string) {
        return this._entities.get(id)!;
    }

    public hasEntity(id: string) {
        return this._entities.has(id);
    }

    private setupDynamicWorld() {
        console.log('setupDynamicWorld')

        // Setup our world
        var world = this._dynamicWorld = new CANNON.World();
        world.gravity = new CANNON.Vec3(0, 0, -9.82) // m/s²
        
        //mat1
        const groundMaterial = new CANNON.Material("groundMaterial");
        const ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
            friction: 0.4,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8
        });
        world.addContactMaterial(ground_ground_cm);

        const slipperyMaterial = new CANNON.Material("slipperyMaterial");
        const slippery_ground_cm = new CANNON.ContactMaterial(groundMaterial, slipperyMaterial, {
            friction: 0.003,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm);

        this._material_ground = groundMaterial;
        this._material_test = slipperyMaterial;


        const slippery_ground_cm2 = new CANNON.ContactMaterial(slipperyMaterial, slipperyMaterial, {
            friction: 0.000,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm2);


        
        const ground = this.spawnEntity(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(30, 30, 1), {mass: 0, material: this._material_ground});
        ground.dontSync = true;

        const building1 = this.spawnEntity(new CANNON.Vec3(-5, 0, 2), new CANNON.Vec3(2, 4, 2), {mass: 0, material: this._material_ground}, new pc.Color(1, 0, 0));
        building1.dontSync = true;
        
        const stairs = this.spawnEntity(new CANNON.Vec3(-3, 2, 1), new CANNON.Vec3(1, 5, 1), {mass: 0, material: this._material_ground}, new pc.Color(0.5, 0.7, 0));
        stairs.dontSync = true;
        stairs.quaternion.setFromEuler(-35, 0, 0);

        const building2 = this.spawnEntity(new CANNON.Vec3(5, 3, 2), new CANNON.Vec3(2, 2, 6), {mass: 0, material: this._material_ground}, new pc.Color(0.5, 0.7, 0));
        building2.dontSync = true;


        if(this.server.game.isServer) {
            
            for (let i = 0; i < 4; i++) {
                this.spawnEntity(undefined, undefined, undefined, new pc.Color(0.5, 0, 0)).startBotBehaviour();
            }
            
        }

        //const box = this.spawnTestEntity(new CANNON.Vec3(0, 0, 4), new CANNON.Vec3(1, 1, 1), {mass: 200});
        //const box2 = this.spawnTestEntity(new CANNON.Vec3(0, 1, 8), new CANNON.Vec3(1, 1, 1), {mass: 200});
        
        setInterval(() => {

            //console.log("ground: " + this.printPosition(ground.getPosition()));
            //console.log("box: " + this.printPosition(box.getPosition()));

        }, 250)

        //setInterval(() => { this.spawnTestEntity(); }, 1000)
    }

    public spawnEntity(position?: CANNON.Vec3, halfExtends?: CANNON.Vec3, options?: CANNON.IBodyOptions, color?: pc.Color, customId?: string) {

        options = options || {mass: 50};
        color = color || new pc.Color(1, 1, 1);

        console.log('spawn entity')

        if(!options.material) options.material = this._material_test;

        console.log(options)

        const body = this.createRectangleBody(position || new CANNON.Vec3(Math.random()*3-1.5, Math.random()*3-1.5, 2), halfExtends || new CANNON.Vec3(0.2, 0.2, 0.2), options);
        
        const entity = new Entity(this);
        entity.data.color = [color.r, color.g, color.b];
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