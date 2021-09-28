import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
import { Entity } from "../Entity";

export interface IInputHandlerData {
    h?: number
    v?: number
}

export class InputHandler extends Component {

    public entity!: Entity;

    public horizontal: number = 0;
    public vertical: number = 0;

    public isControlledByPlayer: boolean = false;

    constructor() {
        super();

        this.priority = -1000;
        this.watchDataKey('h', {minDifference: 0.01});
        this.watchDataKey('v', {minDifference: 0.01});
    }

    public update(delta: number) {
        super.update(delta);

        if(!this.isControlledByPlayer) return;

        this.horizontal = Input.getHorizontal();
        this.vertical = Input.getVertical();
    }

    public toData() {
        const data: IInputHandlerData = {
            h: this.horizontal,
            v: this.vertical
        }

        return data
    }

    public fromData(data: IInputHandlerData) {

        this.horizontal = 0
        this.vertical = 0

        if(data.h) this.horizontal = data.h;
        if(data.v) this.vertical = data.v;
    }
}