import { Component } from "@game/entity/Component"
import { PhysicBody } from "./PhysicBody";

interface IPositionData {
    x?: number
    y?: number
}

export class Position extends Component {

    public canLerp: boolean = false;
    public lerpAmount: number = 0.5;

    private _targetX: number = 0
    private _targetY: number = 0
    private _x: number = 0
    private _y: number = 0

    private _lastUpdatedPos: number = 0;

    constructor() {
        super();

        this.priority = -1000;
        this.watchDataKey('x', {minDifference: 0.5});
        this.watchDataKey('y', {minDifference: 0.5});
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

            this._lastUpdatedPos = Date.now();
        } else {
            this._x = x;
            this._y = y;

            this.updatePhysicBodyPosition(x, y);
        }
    }


    public updatePhysicBodyPosition(x: number, y: number) {
        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);
            physicBody.setPosition(x, y);
        }
    }

    public start() {
        super.start();
    }

    public update(delta: number) {
        super.update(delta);

        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);

            const body = physicBody.body;

            if(body) {
                this._x = body.position.x;
                this._y = body.position.y;
            }
        }

        
        if(this.canLerp) {

            const time = Date.now() - this._lastUpdatedPos;
            const t = Math.min(time, 2000);

            let itf = 1 - (t / 2000);
            //itf = Math.max(0.8, itf)
            itf = this.lerpAmount


            const newX = Phaser.Math.Interpolation.Linear([this.x, this._targetX], itf);
            const newY = Phaser.Math.Interpolation.Linear([this.y, this._targetY], itf);

            this.updatePhysicBodyPosition(newX, newY);

        }

        
        /*
        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);

            if(this.canLerp) {
                //this.updatePhysicBodyPosition();
            } else {
                
            }

            const pos = physicBody.body.position;

            this._x = pos.x;
            this._y = pos.y;
            
        }
        */
        
        
        
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