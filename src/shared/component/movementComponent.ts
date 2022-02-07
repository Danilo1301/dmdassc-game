import * as pc from "playcanvas";
import { Render } from "../../client/render";
import { Entity } from "../entity/entity";
import { Input } from "../input";
import { Component } from "./component";
import { InputHandlerComponent } from "./inputHandlerComponent";

export class MovementComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public speed = 4;

    private _inputHandlerComponent?: InputHandlerComponent;

    public init() {
        super.init();

        this._inputHandlerComponent = this.entity.getComponent(InputHandlerComponent);
    }

    public update(dt: number) {
        super.update(dt);

        const inputHandlerComponent = this._inputHandlerComponent;

        if(!inputHandlerComponent) return;

        const speed = this.speed;

        this.entity.transform.applyForce(inputHandlerComponent.horizontal * speed * dt, inputHandlerComponent.vertical * speed * dt);
    }
}