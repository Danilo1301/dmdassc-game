import { Component } from "@game/entity/Component"
import { PhysicBody } from "./PhysicBody";

interface IPositionData {
    x?: number
    y?: number
}

export class Position extends Component {

    public canLerp: boolean = true;
    public lerpAmount: number = 0.5;

    private _targetX: number = 0
    private _targetY: number = 0
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
            this._x = Phaser.Math.Interpolation.Linear([this._x, this._targetX], this.lerpAmount);
            this._y = Phaser.Math.Interpolation.Linear([this._y, this._targetY], this.lerpAmount);
        }

        
            if(this.entity.hasComponent(PhysicBody)) {
                const physicBody = this.entity.getComponent(PhysicBody);
    
                if(this.canLerp) {
                    physicBody.setPosition(this._x, this._y);
                } else {
                    const pos = physicBody.body.position;
    
                    this._x = pos.x;
                    this._y = pos.y;
                }
                
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