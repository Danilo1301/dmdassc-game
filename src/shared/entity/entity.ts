import * as pc from 'playcanvas';
import { v4 as uuidv4 } from 'uuid';
import { Component } from '../component/component';
import { TransformComponent } from '../component/transformComponent';
import { World } from '../world';

export class Entity {
    public data: any = {};

    public destroyed: boolean = false;
    
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

    public setId(id: string) {
        this._id = id;
    }

    public addComponent<C extends Component>(c: C) {
        c.entity = this;
        this._components.push(c);
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
}