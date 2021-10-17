import { Input } from "@game/input/Input";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { Entity } from "../Entity";
import { Component } from "./Component";
import { DebugComponent } from "./DebugComponent";

export class InputHandlerComponent extends Component {

    public entity!: Entity;

    public controlledByPlayer: boolean = false;

    public get horizontal() { return this.entity.data.input.x as number; }
    public set horizontal(value: number) { this.entity.data.input.x = value; }

    public get vertical() { return this.entity.data.input.y as number; }
    public set vertical(value: number) { this.entity.data.input.y = value; }

    public get mouse1() { return this.entity.data.input.mouse1 as boolean; }
    public set mouse1(value: boolean) { this.entity.data.input.mouse1 = value; }

    constructor() {
        super();

        
    }

    public start() {
        super.start();

        this.entity.data.input = {x: 0, y: 0, mouse1: false};
    }

    public update(delta: number) {
        super.update(delta);

        if(!this.controlledByPlayer) return;

        this.horizontal = Input.getHorizontal();
        this.vertical = Input.getVertical();
        this.mouse1 = Input.getMouseDown();

        this.entity.getComponent(DebugComponent).setLineText('inputHandler', `h ${this.horizontal}; v ${this.vertical}; ${this.mouse1}`);

        this.handleLookRotation();
    }

    private handleLookRotation() {
        const pos1 = {
            x: this.entity.position.x,
            y: this.entity.position.y
        }

        const pos2 = {
            x: this.entity.position.x + Input.mousePosition.x - SceneManager.phaser.scale.gameSize.width/2,
            y: this.entity.position.y + Input.mousePosition.y - SceneManager.phaser.scale.gameSize.height/2
        }

        const angle = Phaser.Math.Angle.BetweenPoints(pos1, pos2);

        this.entity.setLookRotation(angle);
    }
}