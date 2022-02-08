import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";

export interface ITransformComponent_Data {
    x: number
    y: number
    velX: number
    velY: number
    angle: number
    aimAngle: number
}

export class TransformComponent extends Component {
    public entity: Entity;
    public priority: number = 1000;

    private _collisionComponent?: CollisionComponent;

    public data: ITransformComponent_Data = {
        angle: 0,
        aimAngle: 0,
        x: 0,
        y: 0,
        velX: 0,
        velY: 0
    }
    
    public getAngle() {
        return this.data.angle;
    }

    public setAngle(angle: number) {
        this.data.angle = angle;
    }

    public getAimAngle() {
        return this.data.aimAngle;
    }

    public setAimAngle(angle: number) {
        this.data.aimAngle = angle;
    }

    public getPosition() {
        return new pc.Vec2(this.data.x, this.data.y);
    }
    
    public setPosition(x: number, y: number) {
        this.data.x = x;
        this.data.y = y;
    }

    public getVelocity() {
        return new pc.Vec2(this.data.velX, this.data.velY);
    }

    public setVelocity(x: number, y: number) {
        this.data.velX = x;
        this.data.velY = y;
    }
    
    public applyForce(x: number, y: number) {
        this._collisionComponent?.applyForce(x, y);
    }

    public init() {
        super.init();

        this._collisionComponent = this.entity.getComponent(CollisionComponent);
    }

    public preupdate(dt: number) {
        super.preupdate(dt);
    }

    public update(dt: number) {
        super.update(dt);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}