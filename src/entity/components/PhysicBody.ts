import { Component } from "@game/entity/Component"
import { Entity } from "../Entity";

interface IPhysicBodyData {
    angle?: number
}

export class PhysicBody extends Component {
    public entity!: Entity;

    private _body?: MatterJS.BodyType;
    private _options: MatterJS.IChamferableBodyDefinition = {
        frictionAir: 0.2,
        mass: 100
    }
    private _targetAngle: number = 0;

    constructor() {
        super();

        this.priority = -1000;
        this.watchDataKey('angle', {minDifference: 0.01});
        //this.watchDataKey('velX', {minDifference: 0.1});
        //this.watchDataKey('velY', {minDifference: 0.1});

    }

    public get body() { return this._body!; }

    public start() {
        super.start();

        this.createBody();
    }

    public setOptions(options: MatterJS.IChamferableBodyDefinition) {
        this._options = options;
    }


    public createBody() { 
        const scene = this.entity.world.scene;
        const matter = scene.matter;

        const options: MatterJS.IChamferableBodyDefinition = Object.assign({}, this._options)
            
        const parts: MatterJS.BodyType[] = []
        const body1 = matter.bodies.rectangle(0, 0, 30, 30, options);
        parts.push(body1);
        
        options.parts = parts;
    
        const body = this._body = matter.body.create(options);
        matter.world.add(body);

        this.setPosition(this.entity.position.x, this.entity.position.y);
    }

    public setPosition(x: number, y: number) {
        var body = this._body;

        if(!body) return;

        var scene =  this.entity.world.scene;
        var matter = scene.matter;

        matter.body.setPosition(body, {x: x, y: y});
    }

    public setAngle(angle: number) {
        var body = this._body;

        if(!body) return;

        var scene =  this.entity.world.scene;
        var matter = scene.matter;

        matter.body.setAngle(body, angle);
        matter.body.setAngularVelocity(body, 0);
    }

    public applyForce(position: Phaser.Math.Vector2, force: Phaser.Math.Vector2) {
        var body = this._body!;
        var scene =  this.entity.world.scene;
        var matter = scene.matter;

        matter.body.applyForce(body, position, force);
    }

    public setVelocity(velocity: Phaser.Math.Vector2) {
        var body = this._body!;
        var scene =  this.entity.world.scene;
        var matter = scene.matter;

        matter.body.setVelocity(body, velocity);
    }

    public update(delta: number) {
        super.update(delta);

        if(this.entity.position.canLerp) {
            const newAngle = Phaser.Math.Interpolation.Linear([this.body.parent.angle, this._targetAngle], this.entity.position.lerpAmount);

            this.setAngle(newAngle);
        }

        //console.log(this.body.parent.angle)

        //this.setPosition(this.entity.position.x, this.entity.position.y);
    }

    public destroy() {
        super.destroy();
    }

    public toData() {
        const data: IPhysicBodyData = {
            angle: this.body.parent.angle,
            //velX: this.body.velocity.x,
            //velY: this.body.velocity.y
        }


        return data
    }

    public fromData(data: IPhysicBodyData) {

        if(data.angle) {
            if(this.entity.position.canLerp) this._targetAngle = data.angle
            else this.setAngle(data.angle)
        }
    }
}