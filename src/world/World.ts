import { EntityObject } from '@game/entities/object/EntityObject';
import { EntityPlayer } from '@game/entities/player/EntityPlayer';
import { EntityProjectile } from '@game/entities/projectile/EntityProjectile';
import { EntityVehicle } from '@game/entities/vehicle/EntityVehicle';
import { Component } from '@game/entity/Component';
import { BasicMovement } from '@game/entity/components/BasicMovement';
import { InputHandler } from '@game/entity/components/InputHandler';
import { PlayerBehaviour } from '@game/entity/components/PlayerBehaviour';
import { TestFollow } from '@game/entity/components/TestFollow';
import { TestSpawnProjectile } from '@game/entity/components/TestSpawnProjectile';
import { Entity } from '@game/entity/Entity';
import { ICreateEntityOptions } from '@game/entityFactory/EntityFactory';
import { SceneManager } from '@game/sceneManager/SceneManager';
import { GameScene } from '@game/scenes/GameScene';
import { Server } from '@game/server/Server';
import { v4 as uuidv4 } from 'uuid';

export class World {

    public events = new Phaser.Events.EventEmitter();

    private _id: string = "";
    private _server: Server;
    private _scene?: Phaser.Scene;
    private _entities = new Phaser.Structs.Map<string, Entity>([]);

    constructor(server: Server) {
        this._server = server;

        console.log(`[World] Created`);
    }

    public get id() { return this._id; }
    public set id(value: string) { this._id = value; }
    public get entities() { return this._entities.values(); }
    public get scene() { return this._scene!; }
    
    public async init() {
        await this.setupWorld();

        //const player = <EntityPlayer>this.createEntity('', {});
        //this.addEntity(player);
        //console.log(player);
    }

    public update(delta: number) {
        //console.log(`[World] Update ${delta}`);

        for (const entity of this.entities) entity.update(delta);
    }

    public spawnProjectile(position: Phaser.Math.Vector2, angle: number) {
        const projectile = <EntityProjectile>this.createEntity('EntityProjectile', {});
        this.addEntity(projectile);
        projectile.position.set(position.x, position.y);
        projectile.position.setDirection(angle);
        return projectile;
    }

    public createPlayer() {
        const player = <EntityPlayer>this.createEntity('EntityPlayer', {});
        this.addEntity(player);
        player.position.set(200, 200);
        return player;
    }

    public createObject() {
        const object = <EntityObject>this.createEntity('EntityObject', {});
        this.addEntity(object);
        object.position.set(300, 300);
        return object;
    }

    public createVehicle() {
        const e = <EntityVehicle>this.createEntity('EntityVehicle', {});
        this.addEntity(e);
        e.position.set(200, 300);
        return e;
    }

    public createEntity(entityType: string, options: ICreateEntityOptions) {

        const entity = this._server.entityFactory.createEntity(entityType, this, options);
        entity.position.set(100, 100);

        return entity
    }

    public hasEntity(id: any) {
        return this._entities.has(id);
    }

    public getEntity(id: any) {
        return this._entities.get(id);
    }

    public addEntity(entity: Entity, components?: Component[]) {
        //console.log('[World]', `Add entity ${entity.constructor.name}`);
        this._entities.set(entity.id, entity);

        if(components != undefined) {
            for (const component of components) {
                entity.addComponent(component);
            }
        }
        
        entity.start();
        return entity;
    }

    public removeEntity(entity: Entity) {
        //console.log('[World]', `Remove entity ${entity.constructor.name}`);
        this._entities.delete(entity.id);
        entity.destroy();
    }

    private async setupWorld() {
        const gameScene = GameScene.Instance;

        if(gameScene) this._scene = gameScene;
        else await this.createScene();

        this.setupEvents();

        console.log(`[World] Ready`)

        this.events.emit('ready');
    }

    public setupDefaultWorld() {

       
       
        setInterval(() => {

            let crates = 0;

            for (const entity of this.entities) {
                //if(entity instanceof EntityObject) {
                    
                    const distance = Phaser.Math.Distance.BetweenPoints({x: 0, y: 0}, {x: entity.position.x, y: entity.position.y})

                    if(distance <= 400) {
                        crates++;
                    }

                    if(distance > 500 && !(entity instanceof EntityProjectile )) entity.position.set(0, 0);
                    
               // }
            }

            //if(crates < 3) this.createObject();

            //console.log("y", crates)

        }, 500)

        for (let i = 0; i < 4; i++) {
            this.createObject();
        }

        this.createVehicle()
        this.createVehicle()
        this.createVehicle()
        //this.createVehicle()//.addComponent(new TestFollow())
        
        for (let i = 0; i < 3; i++) {
            const bot = this.createPlayer();
        
            bot.addComponent(new TestFollow())
            bot.getComponent(BasicMovement).directional = true;

            if(i == 0) {
                bot.addComponent(new TestSpawnProjectile())

                
            }

            setInterval(() => {

                bot.getComponent(PlayerBehaviour)._test = `test ${Phaser.Math.RND.integerInRange(0, 10000)}`
    
            }, 1000)

            
        }
        

        setInterval(() => {

            //this.spawnProjectile(new Phaser.Math.Vector2(0, 0), Phaser.Math.DegToRad(45));

        }, 1500)
        
    }

    private async createScene() {
        const phaser = await SceneManager.createPhaserInstance();
        this._scene = phaser.scene.getScenes()[0];
    }

    private setupEvents() {
        this._scene!.events.on('update', (time: number, delta: number) => this.update(delta));
    }
}