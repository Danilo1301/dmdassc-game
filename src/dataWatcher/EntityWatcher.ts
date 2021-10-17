import { Entity } from "@game/entity/Entity";
import { DataWatcher } from "./DataWatcher";

export class EntityWatcher {

    private _dataWatcher: DataWatcher;

    constructor(entity: Entity) {
        this._dataWatcher = new DataWatcher(entity.data);
    }

    public process() {
        this._dataWatcher.process();
    }

    public getNewData() {
        const data = this._dataWatcher.getNewData();

        let numKeys = 0;
        for (const key in data) numKeys++;
        if(numKeys == 0) return;

        return data;
    }
}