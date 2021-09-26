import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
import { Entity } from "../Entity";

export class InputHandler extends Component {

    public entity!: Entity;

    public horizontal: number = 0;
    public vertical: number = 0;

    public isControlledByPlayer: boolean = false;

    public update(delta: number) {
        super.update(delta);

        if(!this.isControlledByPlayer) return;

        this.horizontal = Input.getHorizontal();
        this.vertical = Input.getVertical();
    }
}