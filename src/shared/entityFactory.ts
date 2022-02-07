import { Component } from "./component/component";
import { Entity } from "./entity/entity";

export class EntityFactory {

    private _allComponents: { new(...args: any[]): Component }[] = [];
    private _allEntities: { new(...args: any[]): Entity }[] = [];


    public registerEntity<T extends Entity>(constr: { new(...args: any[]): T }) {
        this._allEntities.push(constr);
    }

    public registerComponent<T extends Component>(constr: { new(...args: any[]): T }) {
        this._allComponents.push(constr);
    }

    public getIndexOfComponent<T extends Component>(c: T) {
        let i = 0;
        for (const constr of this._allComponents) {
            if(constr.name == c.constructor.name) return i;
            i++;
        }
        throw "Component " + c.constructor.name + " not found";
    }

    public getEntityByIndex(index: number) {
        return this._allEntities[index];
    }

    public getComponentByIndex(index: number) {
        return this._allComponents[index];
    }

    public getIndexOfEntity<T extends Entity>(c: T) {
        let i = 0;
        for (const constr of this._allEntities.values()) {
            if(constr.name == c.constructor.name) return i;
            i++;
        }
        throw "Entity " + c.constructor.name + " not found";
    }
}