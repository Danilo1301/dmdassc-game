import { EntityPlayer } from '@game/entity/EntityPlayer';
import { Component } from '@game/entity/component/Component';

import { Entity } from '@game/entity/Entity';
import { ICreateEntityOptions } from '@game/entityFactory/EntityFactory';
import { SceneManager } from '@game/sceneManager/SceneManager';
import { GameScene } from '@game/scenes/GameScene';
import { Server } from '@game/server/Server';
import { v4 as uuidv4 } from 'uuid';
import { DataWatcher } from '@game/dataWatcher/DataWatcher';
import { FollowComponent } from '@game/entity/component/FollowComponent';
import { EntityObject } from '@game/entity/EntityObject';
import { WeaponComponent } from '@game/entity/component/WeaponComponent';

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
    public get server() { return this._server!; }
    public get isHost() { return this.server.isHost; }
    
    public async init() {
        await this.setupWorld();
    }

    public update(delta: number) {
        //console.log(`[World] Update ${delta}`);

        for (const entity of this.entities) entity.preupdate(delta);
        for (const entity of this.entities) entity.update(delta);
        for (const entity of this.entities) entity.postupdate(delta);
    }

    public spawnPlayer(color?: number) {
        const player = <EntityPlayer>this.createEntity('EntityPlayer', {});

        player.setPosition(200, 200);

        //player.data.spawnedFromServer = true;

        //player.data.test = [{id: 'test_entity', count: 12}];
        setInterval(() => {
            //player.data.test[0].count = (Phaser.Math.RND.integerInRange(0, 10000));
            
        }, 3000)
        setInterval(() => {
            //player.data.position.x += (Phaser.Math.RND.integerInRange(1, 3));
            //player.data.position.y = (Phaser.Math.RND.integerInRange(100, 600));
        }, 1620)

        player.setColor(Phaser.Math.RND.integerInRange(0, 0xffffff));

        if(color != undefined) player.setColor(color);
        this.addEntity(player);
        return player;
    }

    public spawnEntity(entityType: string, options: ICreateEntityOptions) {
        const e = this.createEntity(entityType, options);
        this.addEntity(e);
        return e;
    }

    public createEntity(entityType: string, options: ICreateEntityOptions) {
        const entity = this._server.entityFactory.createEntity(entityType, this, options);
        //entity.position.set(100, 100);

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
        
        for (let i = 0; i < 1; i++) {
            const player = this.spawnPlayer();
            player.addComponent(new FollowComponent())
            player.getComponent(WeaponComponent).autoShot = true;
            
        }

        for (let i = 0; i < 2; i++) {
            const object = <EntityObject>this.spawnEntity('EntityObject', {});

            if(i == 0) {
                const c = <WeaponComponent>object.addComponent(new WeaponComponent());
                c.autoShot = true;
                
            }
            //object.addComponent(new FollowComponent())
            
        }

    }

    private async createScene() {
        const phaser = await SceneManager.createPhaserInstance();
        this._scene = phaser.scene.getScenes()[0];
    }

    private setupEvents() {
        this._scene!.events.on('update', (time: number, delta: number) => this.update(delta));
    }
}