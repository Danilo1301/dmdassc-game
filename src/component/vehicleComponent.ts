import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Input } from '../input/input';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { InputHandlerComponent } from './inputHandlerComponent';
import { PositionComponent } from './positionComponent';

export class VehicleComponent extends Component {
    public speed: number = 3;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        const inputHandler = this.entity.getComponent(InputHandlerComponent);
        const positionComponent = this.entity.getComponent(PositionComponent);
        const collisionComponent = this.entity.getComponent(CollisionComponent);
        const body = collisionComponent.body;
        const angle = positionComponent.angle;

        const s = this.speed * 0.01;
        const force = {
            x: inputHandler.vertical * Math.cos(angle) * s,
            y: inputHandler.vertical * Math.sin(angle) * s
        }

        Matter.Body.applyForce(collisionComponent.body, collisionComponent.body.position, {x: force.x, y: force.y})

        Matter.Body.setAngularVelocity(body, inputHandler.horizontal * 0.1);
    }
}