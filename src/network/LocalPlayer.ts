import { InputHandler } from "@game/entity/components/InputHandler";
import { Entity } from "@game/entity/Entity";
import { GameScene } from "@game/scenes/GameScene";

export class LocalPlayer {
    public static entityId: string = "";
    public static entity?: Entity;

    public static setControllingEntityId(entityId: string) {
        this.entityId = entityId;

        if(this.entity) {
            this.entity.getComponent(InputHandler).isControlledByPlayer = false;
            this.entity.position.canLerp = true;
            this.entity = undefined;

            GameScene.Instance.cameras.main.stopFollow();
        }
    }

    public static beginControllEntity(entity: Entity) {
        this.entity = entity;
        this.entity.getComponent(InputHandler).isControlledByPlayer = true;
        this.entity.position.canLerp = false;

        GameScene.Instance.cameras.main.startFollow(entity.position);
    }
}