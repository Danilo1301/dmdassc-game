import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { InputHandlerComponent } from './inputHandlerComponent';

export class PlayerComponent extends Component {
    public speed: number = 40;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        if(!this.entity.hasComponent(InputHandlerComponent)) return;

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        const move = new pc.Vec2(
            inputHandler.horizontal,
            inputHandler.vertical
        );

        
        if(move.length() > 0) {
            const collisionComponent = this.entity.getComponent(CollisionComponent);
            const s = this.speed * 0.05 * dt;
            Matter.Body.applyForce(collisionComponent.body, collisionComponent.body.position, {x: move.x * s, y: move.y * s})
        }
    }
}