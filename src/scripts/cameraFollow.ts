import * as pc from "playcanvas";

export class CameraFollow extends pc.ScriptType {

    public height: number = 5;
    public followEntity: pc.Entity | null = null;
    public lerp: number = 1;

    public initialize() {
        this.fire('initialize');
    }

    public postInitialize() {
        this.fire('postInitialize');
    }

    public forceTeleport() {
        if(this.followEntity) this.entity.setPosition(this.getTargetPosition());
    }

    private getTargetPosition() {

        if(!this.followEntity) return pc.Vec3.ZERO;

        const followEntityPosition = this.followEntity.getPosition();
        
        const targetPosition = new pc.Vec3(
            followEntityPosition.x,
            followEntityPosition.y + this.height,
            followEntityPosition.z
        );

        return targetPosition;
    }

    
    public update(dt) {
        this.fire('update', dt);
    }

    public postUpdate(dt) {
        this.fire('postUpdate', dt);

        if(this.followEntity == null) return;


        const newPosition = new pc.Vec3().lerp(
            this.entity.getPosition(),
            this.getTargetPosition(),
            this.lerp
        );

        this.entity.setPosition(newPosition);
    }

    public swap() {
        this.fire('swap');
    }
}

CameraFollow.attributes.add('height', {type: 'number', default: 5});
CameraFollow.attributes.add('followEntity', {type: 'entity'});