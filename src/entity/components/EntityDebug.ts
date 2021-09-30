import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { GameScene } from "@game/scenes/GameScene";
import { Position } from "./Position";

export class EntityDebug extends Component {

    public entity!: Entity;

    private _text?: Phaser.GameObjects.Text;
    private _aimDirLine?: Phaser.GameObjects.Graphics;
    private _lines: {[key: string]: string} = {};

    constructor() {
        super();
    }

    public start(): void {
        super.start();

        if(GameScene.Instance) {

            const scene = this.entity.world.scene;

            this._text = scene.add.text(100, 100, 'TEXT');

            this._aimDirLine = scene.add.graphics();
        }
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

        let str = `${this.entity.constructor.name}\n${Math.round(position.x)}, ${Math.round(position.y)}\n${strLines}`;
        //str += `\nd ${this.entity.position.direction}`
        //str += `\naim d ${this.entity.position.aimDirection}`

        text.setPosition(position.x, position.y);
        text.setText(str);
        text.setDepth(1000);

        if(!this._aimDirLine) return;

        const aimDirLine = this._aimDirLine;

        const linePos = {
            x: 40 * Math.cos(position.aimDirection),
            y: 40 * Math.sin(position.aimDirection)
        }

        aimDirLine.clear();
        //aimDirLine.fillStyle(0xff0000);
        aimDirLine.lineBetween(0, 0, linePos.x, linePos.y);
        aimDirLine.setPosition(position.x, position.y);
    }

    public destroy(): void {
        super.destroy();

        this._text?.destroy();
        this._aimDirLine?.destroy();
    }
}