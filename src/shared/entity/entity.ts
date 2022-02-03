import * as pc from 'playcanvas';
import { v4 as uuidv4 } from 'uuid';
import { Component } from '../component/component';
import { SyncComponent } from '../component/syncComponent';
import { TransformComponent } from '../component/transformComponent';
import { World } from '../world';

class DataObject {
    private _object;

    constructor(object) {
        this._object = object;
    }
}

interface DataOptions {
    minDifference?: number
}

class DataManager {

    private _data: any = {}
    private _oldData: any = {};
    private _changedData: any = {};
    private _options = new Map<string, DataOptions>();
    private _hasDataChanged: boolean = false;

    public mergeData(data: any) {
        const keys: any = {};

        const t = (o, k: string) => {
            for (const key in o) {
                //console.log("merge", key, `(${k}${key})`, o[key], typeof o[key])
    
                if(typeof o[key] == 'object') {
    
                    t(o[key], k + key + ".")

                } else {

                    keys[`${k}${key}`] = o[key];
                }
    
            }
        }
        
        t(data, "");

        for (const key in keys) {
            this.setKey(key, keys[key]);

            //console.log(key, keys[key])
        }

    }

    public clearChangedData() {
        this._changedData = {};
        this._hasDataChanged = false;
    }

    public getData() {
        return this._data;
    }

    public getChangedData() {
        if(!this._hasDataChanged) return undefined;
        return this._changedData;
    }

    public defineKey(key: string, options: DataOptions) {
        this._options.set(key, options);
    }

    /*
    public getObjectRef(key: string) {
        const obj = this.getObject(key, this._data);

        const proxyObj = new Proxy(this._data, {
            get(target, property) {
            }
        });
    }
    */

    public setKey(key: string, value: any) {
        const options = this._options.get(key);

        if(options) {
            let canChange: boolean = false;

            if(typeof value == 'number') {
                const oldValue: number | undefined = this.getObjectKey(this._oldData, key);
                
                if(oldValue == undefined) {
                    canChange = true;
                } else {
                    if(options.minDifference) {
                        const difference = Math.abs(value - (oldValue == undefined ? 0 : oldValue))
                        
                        if(difference > options.minDifference) {
                            canChange = true;
                        }
                    }
                }

                

                
            }

            if(canChange) {
                const oldValue = this.getObjectKey(this._oldData, key);
                
                this.setObjectKey(this._oldData, key, value);
                this.setObjectKey(this._changedData, key, value);

                //console.log(key, 'was', oldValue, 'now:', value)

                this._hasDataChanged = true;
            }
        }
        
        this.setObjectKey(this._data, key, value);
    }

    public getKey(key: string) {
        return this.getObjectKey(this._data, key);
    }

    private getKeyValFromKey(key: string) {
        return key.includes(".") ? key.slice(key.lastIndexOf(".")+1) : key;
    }

    private getObjectKey(object: any, key: string) {
        const keyVal = this.getKeyValFromKey(key);
        const obj = this.getObject(key, object);
        
        return obj[keyVal];
    }

    private setObjectKey(object: any, key: string, value: any) {
        const keyVal = this.getKeyValFromKey(key);
        const obj = this.getObject(key, object);

        obj[keyVal] = value;
    }

    private getObject(key: string, o: object) {
        const path = key.split(".");
        for (const p of path) {
            if(path.indexOf(p) != path.length-1) {
                if(o[p] == undefined) o[p] = {};
                o = o[p];
            }

        }
        return o;
    }
}

export class Entity {
    public data = new DataManager();

    public destroyed: boolean = false;

    public syncInterval: number = 0;
    public lastSync: number = 0;
    
    public get id() { return this._id; }
    public get world() { return this._world; }
    public get components() { return this._components; }
    public get transform() { return this._transform; }
    public get pcEntity() {
        if(!this._pcEntity) {
            this._pcEntity = new pc.Entity('Entity');
            this._pcEntity.addChild(new pc.Entity('Root'))
        }
        return this._pcEntity;
    }
    public get pcEntityRoot() {
        return this.pcEntity.findByName('Root');
    }

    private _pcEntity: pc.Entity;
    private _id: string = uuidv4();
    private _world: World;
    private _components: Component[] = [];
    private _transform: TransformComponent;
    private _hasInitalized: boolean = false;

    constructor(world: World, pcEntity?: pc.Entity) {
        this._world = world;
        if(pcEntity) this._pcEntity = pcEntity;
        this._transform = this.addComponent(new TransformComponent());


        setInterval(() => {

            //this.transform.setVelocity(0,3)

        }, 1500)
    }

    public setId(id: string) {
        this._id = id;
    }

    /*
    public setPcEntity(entity: pc.Entity) {
        this._pcEntity = entity;
    }
    */

    public addComponent<C extends Component>(c: C) {
        c.entity = this;
        this._components.push(c);
        if(this._hasInitalized) c.init();
        return c;
    }

    public hasComponent<C extends Component>(constr: { new(...args: any[]): C }) {
        for (const component of this._components) if (component instanceof constr) return true;
        return false;
    }

    public getComponent<C extends Component>(constr: { new(...args: any[]): C }) {
        for (const component of this._components) if (component instanceof constr) return component as C;
        throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`)
    }

    public init() {
        for (const component of this._components) component.init();
        this._hasInitalized = true;
    }

    public update(dt: number) {
        for (const component of this._components) component.update(dt);
    }

    public postupdate(dt: number) {
        for (const component of this._components) component.postupdate(dt);
    }

    public destroy() {
        if(this.destroyed) return;
        this.destroyed = true;

        for (const component of this._components) component.destroy();
    }

    public mergeEntityData(data) {
        const entity = this;
        
        let syncComponent = entity.hasComponent(SyncComponent) ? entity.getComponent(SyncComponent) : undefined;

        if(data['position']) {
            const newPosition = entity.transform.getPosition();

            if(data['position']['x'] != undefined) {
                newPosition.x = data['position']['x'];
            }
            if(data['position']['y'] != undefined) {
                newPosition.y = data['position']['y'];
            }

            delete data['position'];

            if(syncComponent) {
                syncComponent.setPosition(newPosition.x, newPosition.y);
            } else {
                entity.transform.setPosition(newPosition.x, newPosition.y);
            }
        }

        if(data['angle'] != undefined) {
            const angle: number = data['angle'];

            delete data['angle'];

            if(syncComponent) {
                syncComponent.setAngle(angle)
            } else {
                entity.transform.setAngle(angle)
            }
        }

        this.data.mergeData(data);
    }
}