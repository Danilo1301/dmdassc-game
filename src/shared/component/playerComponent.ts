import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Render } from '../../client/render';
import { Input } from '../input';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { EquipItemComponent } from './equipItemComponent';
import { InputHandlerComponent } from './inputHandlerComponent';

export class PlayerComponent extends Component {
    public speed: number = 80;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        if(!this.entity.hasComponent(InputHandlerComponent)) return;

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        if(inputHandler.enabled) {

            if(Input.mouseDown) {
                
                this.entity.getComponent(EquipItemComponent).tryUse();

                
                
            }

        }

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