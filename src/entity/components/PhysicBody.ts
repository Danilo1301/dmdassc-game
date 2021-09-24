import { Component } from "@game/entity/Component"
import { Entity } from "../Entity";

export class PhysicBody extends Component {

    public entity!: Entity;

    private _body?: MatterJS.BodyType;
    private _options: MatterJS.IChamferableBodyDefinition = {
        frictionAir: 0.2,
        mass: 100,
        inertia: Infinity,
    }

    constructor() {
        super();

        this.priority = -1000;
    }

    public get body() { return this._body!; }

    public start() {
        super.start();

        this.createBody();
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
        var body = this._body!;
        var scene =  this.entity.world.scene;
        var matter = scene.matter;

        matter.body.setPosition(body, {x: x, y: y});
    }

    public applyForce(position: Phaser.Math.Vector2, force: Phaser.Math.Vector2) {
        var body = this._body!;
        var scene =  this.entity.world.scene;
        var matter = scene.matter;

        matter.body.applyForce(body, position, force);
    }

    public update(delta: number) {
        super.update(delta);

        //this.setPosition(this.entity.position.x, this.entity.position.y);
    }

    public destroy() {
        super.destroy();
    }
}