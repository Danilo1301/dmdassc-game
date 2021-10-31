import CANNON from 'cannon'
import * as pc from 'playcanvas';
import { DataWatcher } from '../client/dataWatcher';
import { Entity } from '../entity/entity';
import { EntityObject, IEntityObjectCustomData, IEntityObjectShape } from '../entity/entityObject';
import { EntityPlayer } from '../entity/entityPlayer';
import { Server } from "../server/server";



export class World {

    private _server: Server;
    private _dynamicWorld: CANNON.World;
    private _entities = new Map<string, Entity>();

    public get server() { return this._server };
    public get dynamicWorld() { return this._dynamicWorld };
    public get entities() { return Array.from(this._entities.values()) };

    public _material_ground: CANNON.Material;
    public _material_test: CANNON.Material;
    
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
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm);

        this._material_ground = groundMaterial;
        this._material_test = slipperyMaterial;


        const slippery_ground_cm2 = new CANNON.ContactMaterial(slipperyMaterial, slipperyMaterial, {
            friction: 0.000,
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm2);



        /*
        const building = this.spawnRectangleObject(
            new CANNON.Vec3(5, 3, 2),
            {
                body: new CANNON.Body({mass: 0, material: this._material_ground, shape: new CANNON.Box(new CANNON.Vec3(2, 2, 6))}),
                color: new pc.Color(0.5, 0.7, 0)
            }
        );
        */
        


        
        const groundBodyOptions: CANNON.IBodyOptions = {
            mass: 0,
            material: this._material_ground
        };

        const ground = this.spawnRectangleObject(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(30, 30, 1), groundBodyOptions, new pc.Color(1, 1, 1));
        ground.dontSync = true;

        const building1 = this.spawnRectangleObject(new CANNON.Vec3(-5, 0, 2), new CANNON.Vec3(2, 4, 2), groundBodyOptions, new pc.Color(1, 0, 0));
        building1.dontSync = true;
        
        const stairs = this.spawnRectangleObject(new CANNON.Vec3(-3, 2, 1), new CANNON.Vec3(1, 5, 1), groundBodyOptions,new pc.Color(0.5, 0.7, 0));
        stairs.dontSync = true;
        stairs.quaternion.setFromEuler(-35, 0, 0);

        const building2 = this.spawnRectangleObject(new CANNON.Vec3(5, 3, 2), new CANNON.Vec3(2, 2, 6), groundBodyOptions, new pc.Color(0.5, 0.7, 0));
        building2.dontSync = true;
        

        if(this.server.game.isServer) {

            for (let i = 0; i < 4; i++) {
                const obj = this.spawnCustomObject(
                    new CANNON.Vec3(0, 0, 3),
                    {
                        shape: IEntityObjectShape.RECTANGLE,
                        radius: 0.2,
                        halfExtents: {x: 0.3, y: 0.3, z: 0.3},
                        bodyOptions: {mass: 100},
                    }    
                );
                
            }

            for (let i = 0; i < 4; i++) {
                const bot = this.spawnPlayer();
                bot.setColor(new pc.Color(0, 0, 1))
                bot.startBotBehaviour();
                
            }
            
            
          

          

            setInterval(() => {

                //console.log(bot.toJSON())
            }, 1000)
        }

        


        /*
        if(this.server.game.isServer) {
            
            for (let i = 0; i < 1; i++) {
                this.spawnPlayer().startBotBehaviour();
            }
            
        }
        */

        //const box = this.spawnTestEntity(new CANNON.Vec3(0, 0, 4), new CANNON.Vec3(1, 1, 1), {mass: 200});
        //const box2 = this.spawnTestEntity(new CANNON.Vec3(0, 1, 8), new CANNON.Vec3(1, 1, 1), {mass: 200});
        
        

        //setInterval(() => { this.spawnTestEntity(); }, 1000)
    }

    public spawnRectangleObject(position: CANNON.Vec3, halfExtends: CANNON.Vec3, bodyOptions: CANNON.IBodyOptions, color: pc.Color) {
        const objData: IEntityObjectCustomData = {
            shape: IEntityObjectShape.RECTANGLE,
            halfExtents: halfExtends,
            bodyOptions: bodyOptions,
        }

        const rect = this.spawnCustomObject(
            position,
            objData
        );

        rect.setColor(color);

        return rect;
    }

    public spawnPlayer() {
        const player = new EntityPlayer(this);
        player.position.set(0, 0, 3)
        this.addEntity(player);
        return player;
    }

    public addEntity(entity: Entity) {
        this._entities.set(entity.id, entity);
        entity.init();
    }

    

    public spawnCustomObject(position: CANNON.Vec3, objectData: IEntityObjectCustomData) {
        const object = new EntityObject(this);
        object.setCustomData(objectData);
        object.position.set(position.x, position.y, position.z);
        this.addEntity(object);
        return object;
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

    public createSphereBody(position: CANNON.Vec3, radius: number, options?: CANNON.IBodyOptions) {
        
        const opt = options || {};

        opt.position = position;
     
        var shape = new CANNON.Sphere(radius);
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