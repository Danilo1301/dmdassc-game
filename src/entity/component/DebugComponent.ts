import { GameScene } from "@game/scenes/GameScene";
import { Entity } from "../Entity";
import { Component } from "./Component";

export class DebugComponent extends Component {

    public entity!: Entity;
    private _text?: Phaser.GameObjects.Text;
    private _lines: {[key: string]: string} = {};
    private _aimDirLine?: Phaser.GameObjects.Graphics;

    public enabled: boolean = true;

    constructor() {
        super();

        this.priority = 1000;
    }

    public start() {
        super.start();

        if(!this.enabled) return;

        const scene = GameScene.Instance;
        if(scene) {
            this._text = scene.add.text(0, 0, 'TEXT');
            this._text.setFontSize(10)

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

    public update(delta: number) {
        super.update(delta);

        this.handleText();
        this.handleAimDirLine();
    }

    private handleText() {
        const textObj = this._text;

        if(!textObj) return;

        const objRef = Object.assign({}, this.entity.data);
        delete objRef['components'];

        let str = ``;
        str += `${this.entity.name}`;
        //str += `\n${this.entity.position.x}, ${this.entity.position.y}`;
        //str += `\n${JSON.stringify(objRef)}`;

        let strLines = '';
        for (const key in this._lines) strLines += this._lines[key] + "\n";
        str += `\n${strLines}`;

        textObj.setText(str);
        textObj.setPosition(this.entity.position.x, this.entity.position.y)
    }

    private handleAimDirLine() {
        const aimDirLine = this._aimDirLine;
        
        if(!aimDirLine) return;

        const lookRotation = this.entity.lookRotation;
        const position = this.entity.position;

        const linePos = {
            x: 40 * Math.cos(lookRotation),
            y: 40 * Math.sin(lookRotation)
        }

        let color = this.entity.data.color || 0xffffff;
        
    
        aimDirLine.clear();
        aimDirLine.lineStyle(2, color);
        aimDirLine.lineBetween(0, 0, linePos.x, linePos.y);
        aimDirLine.setPosition(position.x, position.y);
    }

    public destroy() {
        this._aimDirLine?.destroy();
        this._text?.destroy();
    }
}