import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { Gameface } from '../gameface/gameface';
import { Packet } from '../packet/packet';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";

export enum SyncType {
    DONT_SYNC,
    CLIENT_SYNC,
    SERVER_SYNC
}

export class SyncComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    public syncType: SyncType = SyncType.CLIENT_SYNC;

    private _targetPosition = new pc.Vec2();
    private _targetAngle = 0;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        if(this.syncType == SyncType.DONT_SYNC) return;

        const transform = this.entity.transform;

        const x = pc.math.lerp(transform.position.x, this._targetPosition.x, 0.3);
        const y = pc.math.lerp(transform.position.y, this._targetPosition.y, 0.3);
        const agle = pc.math.lerp(transform.angle, this._targetAngle, 0.3);

        transform.setPosition(x, y);
        transform.setAngle(this._targetAngle);
    }

    public setPosition(x: number, y: number) {
        this._targetPosition.set(x, y);
    }

    public setAngle(angle: number) {
        this._targetAngle = angle;
    }
}