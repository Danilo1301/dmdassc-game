import { BaseEntity } from "@game/entity/BaseEntity";
import { Entity } from "@game/entity/Entity";

interface IWatchEntityData {
    components: {[component: string]: {[key: string]: any}}
}

export class EntityWatcher {

    private _entities = new Phaser.Structs.Map<string, BaseEntity>([]);
    private _entitiesData = new Phaser.Structs.Map<string, IWatchEntityData>([]);
    private _entitiesNewData = new Phaser.Structs.Map<string, IWatchEntityData>([]);

    public update(delta: number) {
        for (const entityId of this._entities.keys()) {
            
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

                        if(!newData.components[component.name]) newData.components[component.name] = {};
                        newData.components[component.name][key] = newValue;
                        
                        //console.log(key, oldValue, '->', newValue)
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

            //console.log(this._entitiesData.get(entityId));
            //console.log(this._entitiesNewData.get(entityId));
            //console.log("--")


        }
    }

    public hasEntity(id: string) {
        return this._entities.has(id);
    }

    public addEntity(id: string, entity: Entity) {
        this._entities.set(id, entity);
        this._entitiesData.set(id, {components: {}});
        this._entitiesNewData.set(id, {components: {}});

        console.log(`[EntityWatcher] Entity ${entity.id} added`);
    }

    public getNewEntityData(id: string) {
        return this._entitiesNewData.get(id)
    }
}