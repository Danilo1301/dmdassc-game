import { BaseEntity } from "../entity/baseEntity";
import { DataWatcher } from "./DataWatcher";

export class EntityWatcher {

    private _dataWatcher: DataWatcher;

    constructor(entity: BaseEntity) {
        this._dataWatcher = new DataWatcher(entity, 'toJSON');
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