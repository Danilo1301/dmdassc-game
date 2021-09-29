import { EntityObject } from '@game/entities/object/EntityObject';
import { EntityPlayer } from '@game/entities/player/EntityPlayer';
import { EntityVehicle } from '@game/entities/vehicle/EntityVehicle';
import { Component } from '@game/entity/Component';
import { TestFollow } from '@game/entity/components/TestFollow';
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

        console.log("Create")

        const entity = this._server.entityFactory.createEntity(entityType, this, options);
        entity.position.set(100, 100);

        console.log("Created")

        console.log(entity.world)

        return entity
    }

    public hasEntity(id: any) {
        return this._entities.has(id);
    }

    public getEntity(id: any) {
        return this._entities.get(id);
    }

    public addEntity(entity: Entity, components?: Component[]) {
        console.log('[World]', `Add entity ${entity.constructor.name}`);
        this._entities.set(entity.id, entity);

        if(components != undefined) {
            for (const component of components) {
                entity.addComponent(component);
            }
        }
        
        entity.start();
        return entity;
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
                    
                    const distance = Phaser.Math.Distance.BetweenPoints({x: 300, y: 300}, {x: entity.position.x, y: entity.position.y})

                    if(distance <= 400) {
                        crates++;
                    }

                    if(distance > 500) entity.position.set(300, 300);
                    
               // }
            }

            //if(crates < 3) this.createObject();

            //console.log("y", crates)

        }, 500)

        this.createObject();
        this.createObject();
        this.createObject();
        this.createObject();
        this.createPlayer();
        this.createPlayer();

        this.createVehicle().addComponent(new TestFollow())
        this.createVehicle().addComponent(new TestFollow())
    }

    private async createScene() {
        const phaser = await SceneManager.createPhaserInstance();
        this._scene = phaser.scene.getScenes()[0];
    }

    private setupEvents() {

        console.log("helo?")


        this._scene!.events.on('update', (time: number, delta: number) => this.update(16.6666));
    }
}