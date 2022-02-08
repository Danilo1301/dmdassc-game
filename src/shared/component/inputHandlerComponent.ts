import * as pc from "playcanvas";
import { Render } from "../../client/render";
import { Entity } from "../entity/entity";
import { Input } from "../input";
import { Component } from "./component";

export interface IInputHandler_Data {
    h: number
    v: number
}


export class InputHandlerComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public data: IInputHandler_Data = {
        h: 0,
        v: 0
    }

    public enabled: boolean = false;
    
    public get horizontal() { return this.data.h; }
    public get vertical() { return this.data.v; }

    public set horizontal(value: number) { this.data.h = value; }
    public set vertical(value: number) { this.data.v = value; }

    public setEnabled(value: boolean) {
        this.enabled = value;
    }

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        if(this.enabled) {
            const KEY_LEFT = 65;
            const KEY_RIGHT = 68;
            const KEY_UP = 87;
            const KEY_DOWN = 83;

            this.horizontal = (Input.getKeyDown(KEY_RIGHT) ? 1 : 0) + ((Input.getKeyDown(KEY_LEFT) ? -1 : 0));
            this.vertical = (Input.getKeyDown(KEY_DOWN) ? 1 : 0) + ((Input.getKeyDown(KEY_UP) ? -1 : 0));

            this.entity.transform.setAimAngle(Input.getAimAngle());
           
        }
    }
}