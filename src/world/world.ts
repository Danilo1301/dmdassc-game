import * as pc from "playcanvas";
import { BaseEntity } from "../entity/baseEntity";
import { EntityPlayer } from "../entity/entityPlayer";
import { Game } from "../game/game";

export class World {
    private _game: Game;
    private _entities = new Map<string, BaseEntity>();

    public get game() { return this._game };
    public get app() { return this._game.app };
    public get entities() { return Array.from(this._entities.values()); }
    
    constructor(game: Game) {
        this._game = game;
    }

    public setupWorld() {
        const floor = ShapeUtils.createRectangle(this.app, 'floor', new pc.Vec3(), new pc.Vec3(15, 1, 15), false, new pc.Color(0, 0.5, 0));

        if(this.game.isServer) {
            const p = this.createPlayer(new pc.Vec3());
            p.fromJSON({inputH: 1})
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

        if(position === undefined) position = new pc.Vec3(Math.random()*6-3, 1, Math.random()*6-3);
    
        entity.init();
        entity.teleport(position)

        this.app.root.addChild(entity);

        this._entities.set(entity.id, entity);

        return entity;
    }
    
}


export class ShapeUtils {
    public static createRectangle(app: pc.Application, name: string, position: pc.Vec3, size: pc.Vec3, isDynamic: boolean, color: pc.Color) {
        const entity = new pc.Entity(name);
        entity.setPosition(position)
        this.createRectangleAtEntity(entity, size, isDynamic, color);
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
        cube.addComponent("render", {
            material: material,
            type: "box"
        });
        cube.setLocalScale(size)
        entity.addChild(cube);
        return entity;
    }
}

