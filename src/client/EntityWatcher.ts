import { BaseEntity } from "@game/entity/BaseEntity";
import { Entity } from "@game/entity/Entity";

export interface IWatchEntityData {
    components: {[component: string]: {[key: string]: any}}
}

export class EntityWatcher {
    private _entities = new Phaser.Structs.Map<string, BaseEntity>([]);
    private _entitiesData = new Phaser.Structs.Map<string, IWatchEntityData>([]);
    private _entitiesNewData = new Phaser.Structs.Map<string, IWatchEntityData>([]);

    public update(delta: number) {
        for (const entityId of this._entities.keys()) {
            this.updateEntityData(entityId);
        }
    }

    public hasEntity(entityId: string) {
        return this._entities.has(entityId);
    }

    public addEntity(entityId: string, entity: Entity) {
        this._entities.set(entityId, entity);
        this._entitiesData.set(entityId, {components: {}});
        this._entitiesNewData.set(entityId, {components: {}});

        console.log(`[EntityWatcher] Entity ${entity.id} added`);
    }

    public updateEntityData(entityId: string) {
        const entity = this._entities.get(entityId);

        const data = this._entitiesData.get(entityId);
        const newData = this._entitiesNewData.get(entityId);

        newData.components = {};

        for (const component of entity.components) {

            if(!data.components[component.name]) data.components[component.name] = {}

            const componentData = component.toData();

    
            for (const key in component.watchingKeys) {
                
                const options = component.watchingKeys[key];

                //console.log(key, componentData[key], options);


                const oldValue = data.components[component.name][key];
                const newValue = componentData[key];

                const changeValue = () => {
                    data.components[component.name][key] = newValue;

                    /*
                    if(!newData.components[component.name]) newData.components[component.name] = {};
                    newData.components[component.name][key] = newValue;
                    */
                    newData.components[component.name] = data.components[component.name];
                    //



                    //console.log(component.name, key, oldValue, '->', newValue)
                }

                if(typeof newValue == "number") {
                    
                    const difference = Math.abs((oldValue || 0) - newValue);

                    if(options.minDifference) {
                        if(difference >= options.minDifference) changeValue();
                     
                    } else {

                    }
                    
                } else {
                    //changeValue();
                }

            }
        }
    }

    public getNewEntityData(entityId: string) {
        return this._entitiesNewData.get(entityId)
    }

    public getEntityFullData(entityId: string): any {

        const data: IWatchEntityData = {
            components: {}
        }


        const entity = this._entities.get(entityId);

        for (const component of entity.components) {
            data.components[component.name] = component.toData();
        }

        return data;
    }
}