import { GameScene } from "@game/scenes/GameScene";
import { Entity } from "../Entity";
import { Component } from "./Component";

export class EntitySyncComponent extends Component {

    public entity!: Entity;

    private _targetX: number = 0;
    private _targetY: number = 0;
    private _targetRotation: number = 0;

    public enabled: boolean = true;

    constructor() {
        super();
        this.priority = -999;
    }

    public start() {
        super.start();

        this._targetX = this.entity.position.x;
        this._targetY = this.entity.position.y;
    }

    public preupdate(delta: number) {
        super.preupdate(delta);

        if(!this.enabled) return;

        this.handlePositionLerp();
        this.handleRotationLerp();
    }

    public setPosition(x: number, y: number) {
        this._targetX = x;
        this._targetY = y;
    }

    public setRotation(rotation: number) {
        this._targetRotation = rotation;
    }

    private handlePositionLerp() {
        const position = this.entity.position;
        const distance = Phaser.Math.Distance.Between(position.x, position.y, this._targetX, this._targetY);
    
        let lerpAmount = 0.2;

        if(distance > 30) lerpAmount = 0.8;
        if(distance > 300) lerpAmount = 1;
        
        if(distance > 300 || distance < 1) {
            position.x = this._targetX;
            position.y = this._targetY;
        } else {
            position.x = Phaser.Math.Interpolation.Linear([position.x, this._targetX], lerpAmount);
            position.y = Phaser.Math.Interpolation.Linear([position.y, this._targetY], lerpAmount);
        }

        this.entity.setPosition(position.x, position.y);
    }

    private handleRotationLerp() {
        let rotation = this.entity.rotation;
       
        let lerpAmount = 0.2;

      
        rotation = Phaser.Math.Interpolation.Linear([rotation, this._targetRotation], lerpAmount);
        rotation = Phaser.Math.Interpolation.Linear([rotation, this._targetRotation], lerpAmount);
        

        this.entity.setRotation(rotation);
    }
}