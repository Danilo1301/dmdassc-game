import { Entity } from "../entity/entity";

export class EntityFactory {
    private _registeredEntities = new Map<string, typeof Entity>();

    public registerEntity(name: string, e: typeof Entity) {
        this._registeredEntities.set(name, e);
    }

    public getEntity(name: string) {
        const e = this._registeredEntities.get(name);
        if(!e) throw `Entity type '${name}' is invalid`;
        return e;
    }
}