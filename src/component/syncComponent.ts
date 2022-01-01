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
    private _targetVelocity = new pc.Vec2();
    private _targetAngle = 0;
    private _lastUpdated: number = 0;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        if(this.syncType == SyncType.DONT_SYNC) return;

        const now = Date.now();

        if(now - this._lastUpdated > 500) return;

        
        const transform = this.entity.transform;

        let posLerp = 0.3;
        const distance = this._targetPosition.distance(transform.position);
        if(distance > 30) {
            posLerp = 1;
        }

        const x = pc.math.lerp(transform.position.x, this._targetPosition.x, posLerp);
        const y = pc.math.lerp(transform.position.y, this._targetPosition.y, posLerp);
        const angle = pc.math.lerp(transform.angle, this._targetAngle, 0.3);

        const velX = pc.math.lerp(transform.velocity.x, this._targetVelocity.x, 0.5);
        const velY = pc.math.lerp(transform.velocity.y, this._targetVelocity.y, 0.5);

        transform.setPosition(x, y);
        transform.setAngle(angle);
        transform.setVelocity(velX, velY);
        transform.setAngularVelocity(0);
    }

    public setPosition(x: number, y: number) {
        this._lastUpdated = Date.now();
        this._targetPosition.set(x, y);
    }

    public setAngle(angle: number) {
        this._lastUpdated = Date.now();
        this._targetAngle = angle;
    }

    public setVelocity(x: number, y: number) {
        this._lastUpdated = Date.now();
        this._targetVelocity.set(x, y);
    }
}