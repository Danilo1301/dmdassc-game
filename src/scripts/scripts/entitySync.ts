import * as pc from "../../playcanvas";
import { BaseEntity } from "../entity/baseEntity";
import { Game } from "../game/game";

export class EntitySync extends pc.ScriptType {

    public entity: BaseEntity;
    public positionLerp: number = 0.3;

    private _targetPosition: pc.Vec3 | undefined;

    public initialize() {
        this.fire('initialize');
    }

    public update(dt) {
        this.fire('update', dt);

        const targetPosition = this._targetPosition;

        if(!targetPosition) return;

        const position = this.entity.getPosition();
        const distance = targetPosition.distance(position);

        let positionLerp = this.positionLerp;

        if(distance < 0.1) {
            //positionLerp = 0.05
        }
        if(distance > 0.5) {
            positionLerp = 1;
        }

        //adjust lerp by delta movement

        

        const newPosition = new pc.Vec3(
            pc.math.lerp(position.x, targetPosition.x, positionLerp),
            pc.math.lerp(position.y, targetPosition.y, positionLerp),
            pc.math.lerp(position.z, targetPosition.z, positionLerp)
        );


        this.entity.teleport(newPosition);

        let Ammo = window['Ammo'];
        this.entity.rigidbody!['body'].setLinearVelocity(new Ammo.btVector3(0, 0, 0))
        

        if(distance < 0.01) {
            this.entity.teleport(targetPosition);
            this._targetPosition = undefined;
        }

    }

    public getTargetPosition() {
        return this._targetPosition;
    }

    public setTargetPosition(position: pc.Vec3) {
        this._targetPosition = position.clone();
    }
}