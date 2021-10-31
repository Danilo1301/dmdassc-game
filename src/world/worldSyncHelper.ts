import * as pc from "playcanvas";
import { Entity } from "../entity/entity";
import { EntityPlayer } from "../entity/entityPlayer";
import { GameClient } from "../game/gameClient";
import { IPacketData_EntityData } from "../packet/packet";

export class WorldSyncHelper {
    public static get game() { return GameClient.Instance; };

    public static onReceiveEntityData(data: IPacketData_EntityData) {
        const world = this.game.mainServer.worlds[0];

        let isNewEntity: boolean = false;

        let entity: Entity | undefined;

        if(!world.hasEntity(data.entityId)) {

            const c = world.server.entityFactory.getEntity(data.entityType);

            

            entity = new c(world);
            entity.setId(data.entityId);
            //entity.data = data.data.data; // '-'

           // 
            isNewEntity = true;

            console.log('new entiy')

            console.log([entity])
        }

        if(!entity) entity = world.getEntity(data.entityId);


        //console.log("\n\n", JSON.stringify(data.data))
        entity.fromJSON(data.data);

        if(isNewEntity) {
            world.addEntity(entity);
            entity.canLerp = true;
            //entity.script!.create('entitySync');
        }

        

        if(entity.id == GameClient.playerId) {

            if(!GameClient.player) {
                GameClient.player = entity as Entity;
                GameClient.player.canLerp = false;
                //GameClient.player.setControllable();
                //GameClient.cameraFollowEntity(entity);
            }
        }
    }
}