import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Component } from "./component";

export class CollisionComponent extends Component {
    private _body: Matter.Body;

    public get body() { return this._body; }

    public size = new pc.Vec2(10, 10);
    public frictionAir: number = 0.2;

    public init() {
        super.init();

        const body = this._body = Matter.Bodies.rectangle(0, 0, this.size.x * 10, this.size.y * 10, { friction: 0.001, frictionAir: this.frictionAir });
        Matter.Composite.add(this.entity.world.matterWorld, body);
    }

    public update(dt: number) {
        super.update(dt);
    }
}