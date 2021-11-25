import { Component } from "../component/component";
import { Entity } from "../entity/entity";

export class EntityFactory {
    private _allComponents = new Map<string, { new(...args: any[]): Component }>();
    private _allEntities = new Map<string, { new(...args: any[]): Entity }>();

    public registerEntity<T extends Entity>(name: string, constr: { new(...args: any[]): T }) {
        this._allEntities.set(name, constr);
    }

    public registerComponent<T extends Component>(name: string, constr: { new(...args: any[]): T }) {
        this._allComponents.set(name, constr);
    }

    public getIndexOfComponent<T extends Component>(c: T) {
        let i = 0;
        for (const constr of this._allComponents.values()) {
            if(c instanceof constr) return i;
            i++;
        }
        throw "Component " + c.constructor.name + " not found";
    }

    public getEntityByIndex(index: number) {
        return Array.from(this._allEntities.values())[index];
    }

    public getIndexOfEntity<T extends Entity>(c: T) {
        let i = 0;
        for (const constr of this._allEntities.values()) {
            if(c instanceof constr) return i;
            i++;
        }
        throw "Entity " + c.constructor.name + " not found";
    }
}