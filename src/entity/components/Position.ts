import { Component } from "@game/entity/Component"

interface IPositionData {
    x?: number
    y?: number
}

export class Position extends Component {

    public canLerp: boolean = true;

    private _targetX: number = 0
    private _targetY: number = 0
    private _x: number = 0
    private _y: number = 0
    private _lerpAmount: number = 0.4;

    constructor() {
        super();

        this.priority = -1000;
    }
    
    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public set(x: number, y: number) {

        if(this.canLerp) {
            this._targetX = x;
            this._targetY = y;
        } else {
            this._x = x;
            this._y = y;
        }
    }

    public start() {
        super.start();
    }

    public update(delta: number) {
        super.update(delta);

        if(this.canLerp) {
            this._x = Phaser.Math.Interpolation.Linear([this._x, this._targetX], this._lerpAmount);
            this._y = Phaser.Math.Interpolation.Linear([this._y, this._targetY], this._lerpAmount);
        }
    }

    public destroy() {
        super.destroy();
    }
    
    public toData() {
        const data: IPositionData = {
            x: this.x,
            y: this.y
        }

        return data
    }

    public fromData(data: IPositionData) {
        const newpos = {x: this.x, y: this.y}

        if(data.x) newpos.x = data.x
        if(data.y) newpos.y = data.y

        this.set(newpos.x, newpos.y)
    }
}