import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { InputHandlerComponent } from './inputHandlerComponent';

export class NPCBehaviourComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    private _targetPosition = new pc.Vec2(300, 300);
    private _newPositionTime = 0;
    
    private _inputHandlerComponent?: InputHandlerComponent;

    public init() {
        super.init();

        this._inputHandlerComponent = this.entity.getComponent(InputHandlerComponent);
    }

    public update(dt: number) {
        super.update(dt);

        this.processNewPosition(dt);
        this.processMovement(dt);
    }

    private processNewPosition(dt: number) {
        this._newPositionTime -= dt;
        if(this._newPositionTime <= 0) {
            this._newPositionTime = Math.random()*10;

            const range = 2000;

            this._targetPosition.x = Math.random()*range-(range/2);
            this._targetPosition.y = Math.random()*range-(range/2);
        }
    }

    private processMovement(dt: number) {

        const inputHandlerComponent = this._inputHandlerComponent;

        if(!inputHandlerComponent) return;

        const input = {
            horizontal: 0,
            vertical: 0
        };

        const position = this.entity.transform.getPosition();

        if(position.x < this._targetPosition.x) {
            input.horizontal = 1;
        } else {
            input.horizontal = -1;
        }

        if(position.y < this._targetPosition.y) {
            input.vertical = 1;
        } else {
            input.vertical = -1;
        }

        if(position.distance(this._targetPosition) < 30) {
            input.vertical = 0;
            input.horizontal = 0;
        }

        inputHandlerComponent.horizontal = input.horizontal;
        inputHandlerComponent.vertical = input.vertical;
    }
   
    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}