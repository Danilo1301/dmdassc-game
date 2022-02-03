import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";

export class BulletComponent extends Component {
    public speed: number = 40;

    public init() {
        super.init();

    }


    public update(dt: number) {
        super.update(dt);

        const move = new pc.Vec2(
            Math.cos(this.entity.transform.angle) * 2,
            Math.sin(this.entity.transform.angle) * 2
        );

        const collisionComponent = this.entity.getComponent(CollisionComponent);
        const s = this.speed * 0.05 * dt;
        Matter.Body.applyForce(collisionComponent.body, collisionComponent.body.position, {x: move.x * s, y: move.y * s})
    }
}