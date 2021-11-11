import { EntityPlayer } from "@game/entity/EntityPlayer";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";
import { Component } from "@game/entity/component/Component";


export interface ICreateEntityOptions {
    id?: string
}

export class EntityFactory {
    private _registeredEntities = new Map<string, { new(...args: any[]): Entity }>();
    private _registeredComponents = new Map<string, { new(...args: any[]): Component }>();

    public registerEntity(name: string, constr: { new(...args: any[]): Entity }) {
        this._registeredEntities.set(name, constr);
    }

    public getEntityByName(name: string) {
        return this._registeredEntities.get(name);
    }

    public createEntity(entityType: string, world: World, options: ICreateEntityOptions) {

        const constr = this.getEntityByName(entityType);

        if(!constr) throw new Error("Invalid Entity Type '" + entityType + "'");
        
        var entity = new constr(world);

        if(options.id != undefined) entity.setId(options.id);

        return entity;
    }

    public registerComponent(name: string, constr: { new(...args: any[]): Component }) {
        this._registeredComponents.set(name, constr);
    }

    public getComponentByName(name: string) {
        return this._registeredComponents.get(name);
    }

    public createComponent(componentName: string) {

        const constr = this.getComponentByName(componentName);

        if(!constr) throw new Error("Invalid Component '" + componentName + "'");
        
        const component = new constr();

        return component;
    }
}

//public getComponent<C extends Component>(constr: { new(...args: any[]): C }) {