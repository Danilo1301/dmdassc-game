import { World } from "@game/world/World";
import { BaseEntity } from "./BaseEntity";
import { v4 as uuidv4 } from 'uuid';
import { DataWatcher } from "@game/dataWatcher/DataWatcher";
import { EntitySyncComponent } from "./component/EntitySyncComponent";
import { PhysicBodyComponent } from "./component/PhysicBodyComponent";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { Component } from "./component/Component";

export class Entity extends BaseEntity {


    public dontSync: boolean = false;
    private _id: string;
    private _world: World;
 
    public data: {[dataTag: string]: any} = {
        position: {x: 0, y: 0},
        rotation: 0,
        lookRotation: 0
    };

    constructor(world: World) {
        super();

        this._id = uuidv4();
        this._world = world;
    }

    public get id() { return this._id; }
    public get name() { return this.constructor.name; }
    public get world() { return this._world; }
    public get position() { return {x: this.data.position.x as number, y: this.data.position.y as number}; }
    public get input() { return {x: this.data.input.x as number, y: this.data.input.y as number}; }
    public get rotation() { return this.data.rotation as number; }
    public get lookRotation() { return this.data.lookRotation as number; }

    public start() {
        super.start();
        //console.log(this.name, this.data);
    }

    public update(delta: number) {
        super.update(delta);

        const distance = Phaser.Math.Distance.BetweenPoints(this.position, {x: 0, y: 0});

        if(distance > 500) this.setPosition(0, 0);
    }
    
    public setId(id: string) { this._id = id; }

    public setPosition(x: number, y: number) {
        this.data.position.x = x;
        this.data.position.y = y;
        if(this.hasComponent(PhysicBodyComponent)) this.getComponent(PhysicBodyComponent).setPosition(x, y);
    }

    public setRotation(rotation: number) {
        this.data.rotation = rotation;
        if(this.hasComponent(PhysicBodyComponent)) this.getComponent(PhysicBodyComponent).setAngle(rotation);
    }

    public setLookRotation(lookRotation: number) {
        this.data.lookRotation = lookRotation;
    }

    public addComponent(component: Component) {
        super.addComponent(component);
        
        this.data.components = this.components.map(c => c.name)

        return component;
    }

    public mergeData(data: any) {
        //
        if(data.components) {
            for (const cname of data.components as string[]) {
                if(!this.data.components.includes(cname)) {

                    const component = this.world.server.entityFactory.createComponent(cname);
                    this.addComponent(component);

                }
            }
        }
        //


        const oldPosition = this.position;
        //const oldRotation = this.rotation;

        
        DataWatcher.mergeData(this.data, data);

        const newPosition = this.position;
        const newRotation = this.rotation;
    
        if(this.hasComponent(EntitySyncComponent)) {
            this.getComponent(EntitySyncComponent).setPosition(newPosition.x, newPosition.y);
            this.getComponent(EntitySyncComponent).setRotation(newRotation);
            this.setPosition(oldPosition.x, oldPosition.y)
        } 

        if(this.id == LocalPlayer.entityId) {
            const distance = Phaser.Math.Distance.BetweenPoints(oldPosition, newPosition);
            
            if(distance > 70) this.setPosition(newPosition.x, newPosition.y); 

            //this.setRotation(oldRotation);
        }

        //if(data.rotation != undefined) this.setRotation(data.rotation);

        //console.log(`[Entity] Merge data: ${JSON.stringify(data)}`)
    }
}