import Matter from 'matter-js';
import { CollisionComponent } from "./collisionComponent";
import { Component } from "./component";

export interface IPositionComponent_Data {
    x?: number
    y?: number
    a?: number
}

export class PositionComponent extends Component {
    public priority: number = 1000;

    private _x: number = 0;
    private _y: number = 0;
    private _angle: number = 0;

    public get x() { return this._x; }
    public get y() { return this._y; }
    public get angle() { return this._angle; }

    public update(dt: number) {
        super.update(dt);

        this.handleCollisionComponent();
    }

    public set(x: number, y: number) {
        this._x = x;
        this._y = y;

        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            Matter.Body.setPosition(c.body, {x: this._x * 10, y: this._y * 10});
        }
    }
    
    public setAngle(angle: number) {
        this._angle = angle;

        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            Matter.Body.setAngle(c.body, this._angle);
        }
    }

    private handleCollisionComponent() {
        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);

            this._x = c.body.position.x * 0.1;
            this._y = c.body.position.y * 0.1;
            this._angle = c.body.angle;
        }
    }

    public serialize() {
        const data: IPositionComponent_Data = {
            x: this.x,
            y: this.y,
            a: this.angle
        }
        return data;
    }

    public unserialize(data: IPositionComponent_Data) {

        const newPos = {x: this.x, y: this.y};

        if(data.x != undefined) newPos.x = data.x;
        if(data.y != undefined) newPos.y = data.y;

        if(data.a != undefined) this.setAngle(data.a);

        this.set(newPos.x, newPos.y)

    }
}