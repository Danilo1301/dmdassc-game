import { Component } from "@game/entity/Component"
import { EntityDebug } from "./EntityDebug";
import { PhysicBody } from "./PhysicBody";

export interface IPositionData {
    x?: number
    y?: number
    dir?: number
    aimDir?: number
}

export class Position extends Component {

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

    constructor() {
        super();

        this.priority = -1000;
        this.watchDataKey('x', {minDifference: 0.05});
        this.watchDataKey('y', {minDifference: 0.05});
        this.watchDataKey('dir', {minDifference: 0.001});
        this.watchDataKey('aimDir', {minDifference: 0.001});
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
    
            if(t < 20) {

                if(distance > 40) {
                    this._x = this._targetX;
                    this._y = this._targetY;
                } else {
                    this._x = Phaser.Math.Interpolation.Linear([this._x, this._targetX], 0.5);
                    this._y = Phaser.Math.Interpolation.Linear([this._y, this._targetY], 0.5);
                }
            }
            

            this._direction = Phaser.Math.Angle.RotateTo(this._direction, this._targetDirection, 0.2);
            this._aimDirection = Phaser.Math.Angle.RotateTo(this._aimDirection, this._targetAimDirection, 0.8);

            this.updatePhysicBody();
        }

    }

    private updatePhysicBody() {
        if(!this.entity.hasComponent(PhysicBody)) return;

        const physicBody = this.entity.getComponent(PhysicBody);

        physicBody.setPosition(this._x, this._y);
        physicBody.setAngle(this._direction);
        
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


/*
import { Component } from "@game/entity/Component"
import { EntityDebug } from "./EntityDebug";
import { PhysicBody } from "./PhysicBody";

export interface IPositionData {
    x?: number
    y?: number
    dir?: number
    aimDir?: number
}

export class Position extends Component {

    public canLerp: boolean = false;
    public lerpAmount: number = 0.8;

    private _targetX: number = 0
    private _targetY: number = 0
    private _x: number = 0
    private _y: number = 0

    private _targetDirection: number = 0
    private _direction: number = 0

    private _targetAimDirection: number = 0
    private _aimDirection: number = 0

    constructor() {
        super();

        this.priority = -1000;
        this.watchDataKey('x', {minDifference: 0.05});
        this.watchDataKey('y', {minDifference: 0.05});
        this.watchDataKey('dir', {minDifference: 0.001});
        this.watchDataKey('aimDir', {minDifference: 0.001});
    }
    
    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get direction(): number {
        return this._direction;
    }

    public get aimDirection(): number {
        return this._aimDirection;
    }


    public set(x: number, y: number) {

        if(this.canLerp) {
            this._targetX = x;
            this._targetY = y;
        } else {
            this._x = x;
            this._y = y;

            this.updatePhysicBodyPosition(x, y);
        }
    }

    public setDirection(angle: number) {

        if(this.canLerp) {
            this._targetDirection = angle;
        } else {
            this._direction = angle;

            this.updatePhysicBodyPosition(this.x, this.y, angle);
        }
    }

    public setAimDirection(angle: number) {
        this._aimDirection = angle;
    }



    public updatePhysicBodyPosition(x: number, y: number, angle?: number) {
        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);

            this._x = x;
            this._y = y;

            physicBody.setPosition(x, y);

            if(angle != undefined) {
                this._direction = angle;
                physicBody.setAngle(angle);
            }
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
                this._direction = body.parent.angle;
            }
        }

        const now = Date.now();

        if(this.canLerp) {
            const dist = Phaser.Math.Distance.BetweenPoints({x: this.x, y: this.y}, {x: this._targetX, y: this._targetY});

            let newX = Phaser.Math.Interpolation.Linear([this.x, this._targetX], this.lerpAmount);
            let newY = Phaser.Math.Interpolation.Linear([this.y, this._targetY], this.lerpAmount);

            if(dist > 80) {
                newX = this._targetX
                newY = this._targetY
            }

            const newAngle = Phaser.Math.Angle.RotateTo(this._direction, this._targetDirection, 0.1)

            this.updatePhysicBodyPosition(newX, newY, newAngle);
        }

        
    }

    public destroy() {
        super.destroy();
    }
    
    public toData() {
        const data: IPositionData = {
            x: this.x,
            y: this.y,
            dir: this.direction,
            aimDir: this._aimDirection,
        }

        return data
    }

    public fromData(data: IPositionData) {
        const newpos = {x: this.x, y: this.y}

        if(data.x) newpos.x = data.x
        if(data.y) newpos.y = data.y

        this.set(newpos.x, newpos.y)

        if(data.dir) this.setDirection(data.dir);
        if(data.aimDir) this.setAimDirection(data.aimDir);

    }
}
*/