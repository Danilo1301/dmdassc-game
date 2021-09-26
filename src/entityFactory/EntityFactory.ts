import { EntityPlayer } from "@game/entities/player/EntityPlayer";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";


export interface ICreateEntityOptions {
    id?: string
}

export class EntityFactory {
    private _registeredEntities = new Map<string, { new(...args: any[]): Entity }>();

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
}

//public getComponent<C extends Component>(constr: { new(...args: any[]): C }) {