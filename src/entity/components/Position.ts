import { Component } from "@game/entity/Component"

interface IPositionData {
    x?: number
    y?: number
}

export class Position extends Component {

    private _x: number = 0
    private _y: number = 0

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
        this._x = x;
        this._y = y;
    }

    public start() {
        super.start();
    }

    public update(delta: number) {
        super.update(delta);
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