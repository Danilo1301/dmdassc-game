import * as pc from "../../playcanvas";
import { BaseEntity } from "../entity/baseEntity";
import { EntityPlayer } from "../entity/entityPlayer";
import { CreateCanvas } from "../game/createCanvas";
import { Game } from "../game/game";
import { Server } from "../server/server";

/*
add   let Ammo = window['Ammo'];   to playcanvas.js
*/

export class World {

    private _app: pc.Application;
    private _server: Server;
    private _entities = new Map<string, BaseEntity>();

    public get app() { return this._app; }
    public get server() { return this._server; }
    public get entities() { return Array.from(this._entities.values()); }

    constructor(server: Server) {
        this._server = server;

        if(Game.isHeadless) {
            this._app = server.game.createApplication(CreateCanvas.create());
            this._app.start();
        } else {
            this._app = server.game.app;
        }

        this._app.on('update', (dt) => this.update(dt))

        this.setupWorld();
    }

    public update(dt: number) {
        
    }

    private setupWorld() {

        const floor = World.createRectangle(this.app, 'floor', new pc.Vec3(), new pc.Vec3(10, 1, 10), false, new pc.Color(0, 0.5, 0));

        if(Game.isHeadless) {
            const p = this.createPlayer(new pc.Vec3());
            p.fromJSON({inputH: 0.5})

            setInterval(() => {
                //const entities = this.app.root.children;
                const entities = this.entities;
                console.log(`=== ${entities.length} entities ===`);
                for (const c of entities) {
                    const position = c.getPosition();
                    console.log(`${c.name} | ${position.x}, ${position.y}, ${position.z}`)
                }
            }, 1000)
        }
        
        
    }

    public getEntity(id: string) {
        return this._entities.get(id)!;
    }

    public hasEntity(id: string) {
        return this._entities.has(id);
    }

    public destroyEntity(id: string) {
        const entity = this._entities.get(id)!;
        this.app.root.removeChild(entity);
        this._entities.delete(id);
    }

    public createPlayer(position?: pc.Vec3, customId?: string) {
        const entity = new EntityPlayer('player');

        if(customId) entity.setId(customId);

        if(position === undefined) position = new pc.Vec3(0, 1, 0);
    
        entity.init();
        entity.teleport(position)

        console.log(entity.getPosition())

        this.app.root.addChild(entity);

        this._entities.set(entity.id, entity);

        return entity;
    }

    public static createRectangle(app: pc.Application, name: string, position: pc.Vec3, size: pc.Vec3, isDynamic: boolean, color: pc.Color) {
        const entity = new pc.Entity(name);
        entity.setPosition(position)

        World.createRectangleAtEntity(entity, size, isDynamic, color);

        app.root.addChild(entity);
        return entity;
    }

    public static createRectangleAtEntity(entity: pc.Entity, size: pc.Vec3, isDynamic: boolean, color: pc.Color) {
        entity.addComponent('rigidbody', {
            type: isDynamic ? 'dynamic' : 'static'
        });
        entity.addComponent('collision', {
            type: 'box',
            halfExtents: new pc.Vec3(size.x/2, size.y/2, size.z/2)
        });

        const material = new pc.StandardMaterial();
        material.diffuse = color;
        material.update();
                
        const cube = new pc.Entity('cube');
        //if(!Game.isHeadless) {
            cube.addComponent("render", {
                material: material,
                type: "box"
            });
        //}
        cube.setLocalScale(size)

        entity.addChild(cube);

        return entity;
    }
}