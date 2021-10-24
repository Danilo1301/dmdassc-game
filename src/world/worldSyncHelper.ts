import { Entity } from "../entity/entity";
import { GameClient } from "../game/gameClient";
import { IPacketData_EntityData } from "../packet/packet";

export class WorldSyncHelper {
    public static get game() { return GameClient.Instance; };

    public static onReceiveEntityData(data: IPacketData_EntityData) {
        const world = this.game.mainServer.worlds[0];

        let isNewEntity: boolean = false;

        if(!world.hasEntity(data.entityId)) {
            world.spawnEntity(undefined, undefined, undefined, data.entityId);
            isNewEntity = true;

            console.log('new entiy')
        }

        const entity = world.getEntity(data.entityId);

        entity.fromJSON(data.data);

        if(isNewEntity) {
            //entity.script!.create('entitySync');
        }

        

        if(entity.id == GameClient.playerId) {

            if(!GameClient.player) {
                GameClient.player = entity as Entity;
                //GameClient.player.setControllable();
                //GameClient.cameraFollowEntity(entity);
            }
        }
    }
}