import { EntityPlayer } from "../entity/entityPlayer";
import { IPacket_Entity } from "../packet/packets";
import { Render } from "../render/render";
import { World } from "./world";

export class WorldSync {
    public static entityId: string = "";
    public static world: World;

    public static processEntityPacketData(data: IPacket_Entity) {
        const world = this.world;

        if(!world.hasEntity(data.id)) {
            const constr = world.server.entityFactory.getEntityByIndex(data.type);
            const entity =  new constr(world);
            entity.setId(data.id);
            world.addEntity(entity);
        }

        const entity = world.getEntity(data.id);

        if(entity == Render.player) return;

        if(this.entityId == entity.id) {
            Render.setPlayer(entity);
        }

        for (const component of entity.components) {
            try {
                const cindex = world.server.entityFactory.getIndexOfComponent(component);
                if(data.cdata[cindex]) component.unserialize(data.cdata[cindex])
            } catch (error) {}
        }

     
        console.log(data.cdata)
    }
}