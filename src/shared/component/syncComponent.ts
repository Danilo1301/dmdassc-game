import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";

export enum SyncType {
    DONT_SYNC,
    CLIENT_SYNC,
    SERVER_SYNC
}

export class SyncComponent extends Component {
    public entity: Entity;
    public priority: number = 1010;
    
    public syncType: SyncType = SyncType.CLIENT_SYNC;
    public positionLerp: number = 0.08;

    private _targetPosition = new pc.Vec2();
    private _targetVelocity = new pc.Vec2();
    private _targetAngle = 0;
    private _targetAimAngle = 0;
    private _lastUpdated: number = 0;

    public init() {
        super.init();
    }

    public processSync() {

        if(this.syncType == SyncType.DONT_SYNC) return;

        if(this.syncType == SyncType.CLIENT_SYNC) {
            this.syncClient();
        }

        if(this.syncType == SyncType.SERVER_SYNC) {
            this.syncHost();
        }

        

        

        //console.log(velX, velY)
        //transform.setAngularVelocity(0);
    }

    private syncClient() {
        const now = Date.now();

        let tl = 800;
        let lerpFactor = (1 - (Math.min(tl, now - this._lastUpdated) / tl))

        //lerpFactor = 1;


        //if(now - this._lastUpdated > (this.entity.syncInterval == 0 ? 500 : 1)) return;

        
        const transform = this.entity.transform;

        const position = transform.getPosition();

        let posLerp = this.positionLerp;
        const distance = this._targetPosition.distance(position);
        if(distance > 60) {
            posLerp = 1;
        }

        const x = pc.math.lerp(position.x, this._targetPosition.x, posLerp * lerpFactor);
        const y = pc.math.lerp(position.y, this._targetPosition.y, posLerp * lerpFactor);

        let angle = pc.math.lerpAngle(transform.getAngle(), this._targetAngle, 0.1);
        if(Math.abs(angle - this._targetAngle) >= Math.PI/4) angle = this._targetAngle;

        let aimAngle = pc.math.lerpAngle(transform.getAimAngle(), this._targetAimAngle, 0.5);
        if(Math.abs(aimAngle - this._targetAimAngle) >= Math.PI/4) aimAngle = this._targetAimAngle;

        const velocity = transform.getVelocity();

        const velX = pc.math.lerp(velocity.x, this._targetVelocity.x, 0.8 );
        const velY = pc.math.lerp(velocity.y, this._targetVelocity.y, 0.8 );

        transform.setPosition(x, y);
        transform.setAngle(angle);
        transform.setAimAngle(aimAngle);
        transform.setVelocity(velX, velY);
    }

    private syncHost() {
        /*
        const transform = this.entity.transform;
        const position = transform.getPosition();

        const distance = this._targetPosition.distance(position);

        if(distance > 80) {
            transform.setPosition(this._targetPosition.x, this._targetPosition.y);
        }
        */
    }

    public preupdate(dt: number) {
        super.preupdate(dt);

        this.processSync();
    }

    public setPosition(x: number, y: number) {
        this._lastUpdated = Date.now();
        this._targetPosition.set(x, y);
    }

    public setAngle(angle: number) {
        this._lastUpdated = Date.now();
        this._targetAngle = angle;
    }

    public setAimAngle(angle: number) {
        this._lastUpdated = Date.now();
        this._targetAimAngle = angle;
    }

    public setVelocity(x: number, y: number) {
        this._lastUpdated = Date.now();
        this._targetVelocity.set(x, y);
    }

    public forceLerp() {
        const transform = this.entity.transform;

        transform.setPosition(this._targetPosition.x, this._targetPosition.y);
        transform.setAngle(this._targetAngle);
        transform.setVelocity(this._targetVelocity.x, this._targetVelocity.y);
    }

    public dontSync() {
        this.syncType = SyncType.DONT_SYNC;
    }
}