import * as pc from 'playcanvas';
import { v4 as uuidv4 } from 'uuid';
import { Component } from '../component/component';
import { SyncComponent } from '../component/syncComponent';
import { ITransformComponent_Data, TransformComponent } from '../component/transformComponent';
import { World } from '../world';

export class DataWatcher {

    private _data: any = {};
    //private _changedData: any = {};

    public setData(data: any) {

        //console.log("\n_data:", JSON.stringify(this._data))
        //console.log("new data:", JSON.stringify(data))

        const changedData = this.testObj(data, this._data);
        //console.log("changedData:", JSON.stringify(changedData))

        //this._data = Object.assign({}, data);
        this._data = JSON.parse(JSON.stringify(data));

        return changedData;
    }

    public testObj(o: any, compare: any) {
        //console.log("test obj", JSON.stringify(o))

        let result: any = undefined;
   
        const setResult = (key: string, value: any) => {
            if(result == undefined) result = {}; 

            result[key] = value;
        }

        for (const k in o) {

            //console.log("--", k)


            
            if(o[k] instanceof Object) {
                

                const resultObj = this.testObj(o[k], compare[k]);

                if(resultObj != undefined) {
                    setResult(k, resultObj)
                }
            } else {

                if(compare == undefined) {
                    //console.log("compare not defined")

                    setResult(k, o[k]);
                } else {

                    if(compare[k] != o[k]) {

                        setResult(k, o[k])

                    }

                }

            }

        }

        return result;
    }
}

export class Entity {
    public destroyed: boolean = false;
    
    public dataWatcher: DataWatcher = new DataWatcher();
    
    public canSync: boolean = true;

    public get id() { return this._id; }
    public get world() { return this._world; }
    public get components() { return this._components; }
    public get transform() { return this._transform; }
    public get pcEntity() { return this._pcEntity!; }
    public get pcEntityRoot() { return this.pcEntity.findByName('Root')!; }
    
    /*
    public get pcEntity() {
        if(!this._pcEntity) {
            this._pcEntity = new pc.Entity('Entity');
            this._pcEntity.addChild(new pc.Entity('Root'))
        }
        return this._pcEntity;
    }
    */
    

    private _index: number | null = null;
    private _pcEntity?: pc.Entity;
    private _id: string = uuidv4();
    private _world: World;
    private _components: Component[] = [];
    private _transform: TransformComponent;
    private _hasInitalized: boolean = false;
    private _hasInitalizedData: boolean = false;

    constructor(world: World, pcEntity?: pc.Entity) {
        this._world = world;
        if(pcEntity) this._pcEntity = pcEntity;
        this._transform = this.addComponent(new TransformComponent());
    }

    public getFullData() {
        let fullData: any = undefined;

        for (const component of this.components) {
            const data = component.data;

            if(data == undefined) continue;

            if(fullData == undefined) fullData = {};

            fullData[component.getIndex()] = data;

        }
        return fullData;
    }

    public mergeData(data: any) {
        if(data == undefined) return;

        //
        const transformData = data[this.transform.getIndex()];

        if(transformData != undefined) {
            const transform = this.transform;

            const angle = transform.getAngle();
            const toSyncAngle = transformData.angle != undefined ? transformData.angle : angle;
    
            const position = transform.getPosition();
            const toSyncPosition = {
                x: transformData.x != undefined ? transformData.x : position.x,
                y: transformData.y != undefined ? transformData.y : position.y
            }

            const velocity = transform.getVelocity();
            const toSyncVelocity = {
                x: transformData.velX != undefined ? transformData.velX : velocity.x,
                y: transformData.velY != undefined ? transformData.velY : velocity.y
            }
    
            Object.assign(transform.data, transformData);

            delete data[transform.getIndex()];

            const syncComponent = this.getComponent(SyncComponent);
    
            if(syncComponent) {
                transform.setPosition(position.x, position.y);
                transform.setVelocity(velocity.x, velocity.y);
                transform.setAngle(angle);
                
                syncComponent.setPosition(toSyncPosition.x, toSyncPosition.y);
                syncComponent.setVelocity(toSyncVelocity.x, toSyncVelocity.y);
                syncComponent.setAngle(toSyncAngle);
            }
        }

        //

        for (const component of this._components) {
            const cdata = data[component.getIndex()];
            if(cdata == undefined) continue;
            Object.assign(component.data, cdata);
        }



     
        
        
    }

    public setId(id: string) {
        this._id = id;
    }

    public addComponent<C extends Component>(c: C) {
        c.entity = this;
        this._components.push(c);

        this._components = this._components.sort((a, b) => b.priority - a.priority)

        if(this._hasInitalized) c.init();
        return c;
    }

    public createPcEntity() {
        if(!this._pcEntity) {
            this._pcEntity = new pc.Entity('Entity');
            this._pcEntity.addChild(new pc.Entity('Root'))
        }
    }

    /*
    public hasComponent<C extends Component>(constr: { new(...args: any[]): C }) {
        for (const component of this._components) if (component instanceof constr) return true;
        return false;
    }
    */

    public getComponent<C extends Component>(constr: { new(...args: any[]): C }) {
        for (const component of this._components) if (component instanceof constr) return component as C;
        return 
    }

    public initData() {
        if(this._hasInitalizedData) return;

        for (const component of this._components) component.initData();
        this._hasInitalizedData = true;
    }

    public init() {
        this.initData();
        for (const component of this._components) component.init();
        this._hasInitalized = true;
    }

    public preupdate(dt: number) {
        for (const component of this._components) component.preupdate(dt);
    }

    public update(dt: number) {
        for (const component of this._components) component.update(dt);
    }

    public postupdate(dt: number) {
        for (const component of this._components) component.postupdate(dt);
    }

    public render(dt: number) {
        for (const component of this._components) component.render(dt);
    }

    public postrender(dt: number) {
        for (const component of this._components) component.postrender(dt);
    }

    public destroy() {
        if(this.destroyed) return;
        this.destroyed = true;

        for (const component of this._components) component.destroy();
    }

    public getIndex() {
        
        if(this._index == null) {
            this._index = this.world.game.entityFactory.getIndexOfEntity(this);
        }
        return this._index;
    }
}