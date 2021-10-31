import { Entity } from "../entity/entity";
import { DataWatcher } from "./dataWatcher";

interface IEntityInfo {
    entity: Entity
    dataWatcher: DataWatcher
}

export class EntityWatcher {
    private _entities = new Map<string, IEntityInfo>();

    public hasEntity(entity: Entity) {
        return this._entities.has(entity.id);
    }

    public addEntity(entity: Entity) {
        const info: IEntityInfo = {
            entity: entity,
            dataWatcher: new DataWatcher()
        };

        this._entities.set(entity.id, info);
    }

    public processNewData(entity: Entity) {
        const info = this._entities.get(entity.id)!;
        const data = entity.toJSON();

        const newData = info.dataWatcher.processNewData(data);
        return newData;
    }
}