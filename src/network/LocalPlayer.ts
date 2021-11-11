import { DataWatcher } from "@game/dataWatcher/DataWatcher";
import { EntitySyncComponent } from "@game/entity/component/EntitySyncComponent";
import { InputHandlerComponent } from "@game/entity/component/InputHandlerComponent";
import { Entity } from "@game/entity/Entity";
import { GameClient } from "@game/game/GameClient";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { IPacketData_EntityData, PacketType } from "./Packet";

export class LocalPlayer {
    public static entityId: string = "";
    public static entity?: Entity;

    private static _dataWatcher?: DataWatcher;

    private static _sendDataInterval: number = 30;
    private static _lastSentData: number = 0;

    public static setEntity(entity: Entity) {

        this.entity = entity;
        entity.getComponent(InputHandlerComponent).controlledByPlayer = true;

        if(entity.hasComponent(EntitySyncComponent)) entity.getComponent(EntitySyncComponent).enabled = false;

        GameScene.Instance.cameras.main.startFollow(entity.data.position, false, 0.1, 0.1);

        const dataWatcher = this._dataWatcher = new DataWatcher(entity.data);
    }

    public static update(delta: number) {
        const game = SceneManager.game as GameClient;
        const server = game.servers[0];

        if(!server) return;

        const world = server.worlds[0];

        if(world.hasEntity(this.entityId)) {
            if(!this.entity) {
                const player = world.getEntity(this.entityId);
                this.setEntity(player);
            }
        }

        const now = Date.now();

        const entity = this.entity;
        const dataWatcher = this._dataWatcher;

        if(dataWatcher && entity) {
            if(now - this._lastSentData >= this._sendDataInterval) {
                this._lastSentData = now;

                dataWatcher.process();

                if(dataWatcher.hasNewData()) {
                    const entityData = dataWatcher.getNewData();
                    const data: IPacketData_EntityData = {
                        entityId: entity.id,
                        entityType: entity.name,
                        entityData: entityData
                    }
            
                    //console.log("sending entitydata")

                    game.network.send(PacketType.ENTITY_DATA, data);

                   // console.log(data);
                }

    
        

            }
        }

        
        
    }

    
}