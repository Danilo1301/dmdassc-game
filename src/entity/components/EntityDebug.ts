import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { GameScene } from "@game/scenes/GameScene";
import { Position } from "./Position";

export class EntityDebug extends Component {

    public entity!: Entity;

    private _text?: Phaser.GameObjects.Text;
    private _lines: {[key: string]: string} = {};

    constructor() {
        super();
    }

    public start(): void {
        super.start();

        if(GameScene.Instance)
            this._text = this.entity.world.scene.add.text(100, 100, 'TEXT');
    }

    public setLineText(lineId: string, text?: string) {
        if(text == undefined) {
            delete this._lines[lineId];
            return;
        }
        this._lines[lineId] = text;
    }

    public update(delta: number): void {
        super.update(delta);

        const position = this.entity.position;
        const text = this._text;

        if(!position) return;
        if(!text) return;

        

        let strLines = '';
        for (const key in this._lines) {
            strLines += this._lines[key] + "\n";
        }

        const str = `${this.entity.constructor.name}\n${Math.round(position.x)}, ${Math.round(position.y)}\n${strLines}`;

        text.setPosition(position.x, position.y);
        text.setText(str);
        text.setDepth(1000)
    }

    public destroy(): void {
        super.destroy();

        this._text?.destroy();
    }
}