import * as pc from 'playcanvas';
import { v4 as uuidv4 } from 'uuid';
import { Component } from '../component/component';
import { TransformComponent } from '../component/transformComponent';
import { World } from '../world/world';

export class Entity {
    public data: any = {};

    public get id() { return this._id; }
    public get world() { return this._world; }
    public get components() { return this._components; }
    public get transform() { return this._transform; }
    public get pcEntity() {
        if(!this._pcEntity) this._pcEntity = new pc.Entity();
        return this._pcEntity;
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
}