import { GameScene } from "@game/scenes/GameScene";
import { Entity } from "../Entity";
import { Component } from "./Component";

export enum PhysicBodyType {
    RECTANGLE,
    CIRCLE
}

class BodyPart {
    public key: string;
    public type: PhysicBodyType;
    public x: number;
    public y: number;

    public width: number = 0;
    public height: number = 0;

    public radius: number = 0;

    public body?: MatterJS.BodyType;

    constructor(key: string, x: number, y: number, type: PhysicBodyType) {
        this.key = key;
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

export class PhysicBodyComponent extends Component {

    public entity!: Entity;
   
    private _body?: MatterJS.BodyType;
    private _options: MatterJS.IChamferableBodyDefinition = {
        frictionAir: 0.2,
        mass: 100
    }

    private _bodyParts = new Phaser.Structs.Map<string, BodyPart>([]);

    constructor() {
        super();
        this.priority = -1000;
    }

    public get body() { return this._body!; }
    public get matter() { return this.entity.world.scene.matter; }
    public get angle() { return this.body.parent.angle; }

    public start() {
        super.start();
        this.createBody();
    }

    public addRectangle(key: string, x: number, y: number, width: number, height: number) {
        const bodyPart = new BodyPart(key, x, y, PhysicBodyType.RECTANGLE);
        bodyPart.width = width;
        bodyPart.height = height;
        this._bodyParts.set(key, bodyPart);
        return bodyPart;
    }

    public addCircle(key: string, x: number, y: number, radius: number) {
        var bodyPart = new BodyPart(key, x, y, PhysicBodyType.CIRCLE);
        bodyPart.radius = radius;
        this._bodyParts.set(key, bodyPart);
        return bodyPart;
    }

    public setOptions(options: MatterJS.IChamferableBodyDefinition) {
        this._options = options;
    }

    public createBody() { 
        const scene = this.entity.world.scene;
        const matter = scene.matter;

        const options: MatterJS.IChamferableBodyDefinition = Object.assign({}, this._options)
            
        const parts: MatterJS.BodyType[] = []
        for (const bodyPart of this._bodyParts.values()) {
            if(bodyPart.type == PhysicBodyType.RECTANGLE) bodyPart.body = matter.bodies.rectangle(bodyPart.x, bodyPart.y, bodyPart.width, bodyPart.height, options)
            if(bodyPart.type == PhysicBodyType.CIRCLE) bodyPart.body = matter.bodies.circle(bodyPart.x, bodyPart.y, bodyPart.radius, options)

            parts.push(bodyPart.body!)
        }
 
        
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

    public setTorque(torque: number) {
        var body = this._body!;
        
        body.torque = torque;
    }

    public setVelocity(velocity: Phaser.Math.Vector2) {
        var body = this._body!;
        var scene =  this.entity.world.scene;
        var matter = scene.matter;

        matter.body.setVelocity(body, velocity);
    }

    public preupdate(delta: number) {
        super.update(delta);

        const body = this.body;

        if(body) {
            this.entity.data.position.x = body.position.x;
            this.entity.data.position.y = body.position.y;
            this.entity.data.rotation = this.angle;
        } 
    }

    public destroy() {
        super.destroy();
        this.matter.world.remove(this.body);
    }
}