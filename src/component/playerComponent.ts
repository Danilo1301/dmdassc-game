import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Input } from '../input/input';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { InputHandlerComponent } from './inputHandlerComponent';
import { PositionComponent } from './positionComponent';

export class PlayerComponent extends Component {
    public speed: number = 40;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        const move = new pc.Vec2(
            inputHandler.horizontal,
            inputHandler.vertical
        );

        
        if(move.length() > 0) {
            const collisionComponent = this.entity.getComponent(CollisionComponent);
            const s = this.speed * 0.001;
            Matter.Body.applyForce(collisionComponent.body, collisionComponent.body.position, {x: move.x * s, y: move.y * s})
        }
    }
}