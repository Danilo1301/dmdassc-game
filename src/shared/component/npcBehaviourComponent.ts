import * as pc from "playcanvas";
import { Render } from "../../client/gameface/render";
import { Entity } from "../entity/entity";
import { Input } from "../input/input";
import { Component } from "./component";
import { InputHandlerComponent } from "./inputHandlerComponent";

export class NPCBehaviourComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    private _targetPosition = new pc.Vec2(300, 300);

    private _newPositionTime = 0;

    public init() {
        super.init();

    }

    public update(dt: number) {
        super.update(dt);

        this._newPositionTime -= dt;
        if(this._newPositionTime <= 0) {
            this._newPositionTime = Math.random()*5;

            const range = 1500;

            this._targetPosition.x = Math.random()*range-(range/2);
            this._targetPosition.y = Math.random()*range-(range/2);
        }

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        //inputHandler.horizontal = 1;

        const position = this.entity.transform.getPosition();

        if(position.x < this._targetPosition.x) {
            inputHandler.horizontal = 1;
        } else {
            inputHandler.horizontal = -1;
        }

        if(position.y < this._targetPosition.y) {
            inputHandler.vertical = 1;
        } else {
            inputHandler.vertical = -1;
        }

        if(position.distance(this._targetPosition) < 30) {
            inputHandler.vertical = 0;
            inputHandler.horizontal = 0;
        }
    }
}