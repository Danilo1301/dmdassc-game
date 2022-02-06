import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";

export interface ITransformComponent_Data {
    x: number
    y: number
    angle: number
    aimAngle: number
}

export class TransformComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public collisionComponent?: CollisionComponent;

    public data: ITransformComponent_Data = {
        angle: 0,
        aimAngle: 0,
        x: 0,
        y: 0
    }
    
    public getPosition() {
        return new pc.Vec2(this.data.x, this.data.y);
    }
    
    public setPosition(x: number, y: number) {
        this.data.x = x;
        this.data.y = y;
    }

    public init() {
        super.init();

        this.collisionComponent = this.entity.getComponent(CollisionComponent);
    }

    public update(dt: number) {
        super.update(dt);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}