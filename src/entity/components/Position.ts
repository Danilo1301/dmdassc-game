import { Component } from "@game/entity/Component"
import { Entity } from "../Entity";
import { EntityDebug } from "./EntityDebug";
import { PhysicBody } from "./PhysicBody";

export interface IPositionData {
    x?: number
    y?: number
    dir?: number
    aimDir?: number
}

export class Position extends Component {

    public entity!: Entity;
    
    public canLerp: boolean = false;
    public lerpAmount: number = 0.8;
  
    private _x: number = 0
    private _y: number = 0
    private _direction: number = 0
    private _aimDirection: number = 0

    private _targetX: number = 0
    private _targetY: number = 0
    private _targetDirection: number = 0
    private _targetAimDirection: number = 0

    public lastReceivedNetworkData: number = 0;

    public skipSmallLerp: boolean = false;
    public skipDirectionLerp: boolean = false;

    constructor() {
        super();

        this.priority = -1000;
        this.watchDataKey('x', {minDifference: 0.5});
        this.watchDataKey('y', {minDifference: 0.5});
        this.watchDataKey('dir', {minDifference: 0.01});
        this.watchDataKey('aimDir', {minDifference: 0.01});
    }
    
    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get direction(): number { return this._direction; }
    public get aimDirection(): number { return this._aimDirection; }

    public set(x: number, y: number) {
        this._targetX = x;
        this._targetY = y;

        if(this.canLerp) return;

        this._x = x;
        this._y = y;

        this.updatePhysicBody();
    }

    public setDirection(angle: number) {
        this._targetDirection = angle;

        if(this.canLerp) return;

        this._direction = angle;

        this.updatePhysicBody();
    }

    public setAimDirection(angle: number) {
        this._targetAimDirection = angle;

        if(this.canLerp) return;

        this._aimDirection = angle;

        this.updatePhysicBody();
    }

    public start() {
        super.start();
    }

    public update(delta: number) {
        super.update(delta);

       

        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);
            const body = physicBody.body;

            if(body != undefined) {
                this._x = body.position.x;
                this._y = body.position.y;
                this._direction = body.parent.angle;
            }
        }        

        if(this.canLerp) {
            const t = Date.now() - this.lastReceivedNetworkData;

            //console.log(t)

            const distance = Phaser.Math.Distance.Between(this._x, this._y, this._targetX, this._targetY);
    
            if(t < 20 || this.entity.syncTime === 0) {

                let posLerp = 0.2;

                if(distance > 30 && this.skipSmallLerp == false) {
                    posLerp = 0.8;
                }

                if(distance > 300) {
                    posLerp = 1;
                }

                

                this._x = Phaser.Math.Interpolation.Linear([this._x, this._targetX], posLerp);
                this._y = Phaser.Math.Interpolation.Linear([this._y, this._targetY], posLerp);
            }
            
        
            const d = Math.abs(Math.abs(this._direction) - Math.abs(this._targetDirection));
            let dirLerp = 0.05;
            if(d > 0.2) dirLerp = 1;

            if(this.skipDirectionLerp) dirLerp = 0.3;

            this._direction = Phaser.Math.Angle.RotateTo(this._direction, this._targetDirection, dirLerp);

            
            this._aimDirection = Phaser.Math.Angle.RotateTo(this._aimDirection, this._targetAimDirection, 1);

            this.updatePhysicBody();
        }

    }

    private updatePhysicBody() {
        if(!this.entity.hasComponent(PhysicBody)) return;

        const physicBody = this.entity.getComponent(PhysicBody);

        if(!physicBody.body) return;

        physicBody.setPosition(this._x, this._y);
        physicBody.setAngle( this._direction );
        
    }
    
    public toData() {
        const data: IPositionData = {
            x: this.x,
            y: this.y,
            dir: this._direction,
            aimDir: this._aimDirection,
        }
        return data;
    }

    public fromData(data: IPositionData) {
        const newpos = {x: this.x, y: this.y}

        if(data.x !== undefined) newpos.x = data.x
        if(data.y !== undefined) newpos.y = data.y
        if(data.x !== undefined || data.y !== undefined) this.set(newpos.x, newpos.y);

        if(data.dir !== undefined) this.setDirection(data.dir);
        if(data.aimDir !== undefined) this.setAimDirection(data.aimDir);
    }
}

