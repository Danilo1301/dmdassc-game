import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
import { Entity } from "../Entity";
import { InputHandler } from "./InputHandler";
import { PhysicBody } from "./PhysicBody";

export class VehicleMovement extends Component {

    public entity!: Entity;
    public speed: number = 1;

    private _inputHandler?: InputHandler;

    //private _car?: Phaser.Physics.Matter.Image;

    private _createdBody: boolean = false;

    public start() {
        super.start();
        this._inputHandler = this.entity.getComponent(InputHandler);

        /*
        const car = this._car = this.entity.world.scene.matter.add.image(400, 300, 'car');
        car.setAngle(-90);
        car.setFrictionAir(0.1);
        car.setMass(10);
        */
    }

    public update(delta: number) {
        super.update(delta);

        

        if(!this._inputHandler) return;

        const inputHandler = this._inputHandler;
        const horizontal = inputHandler.horizontal;
        const vertical = inputHandler.vertical;
        const entity = this.entity;
        const speed = this.speed;

        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);

            
            const move = new Phaser.Math.Vector2();
            const angle = physicBody.angle;

            move.x = Math.cos(angle) * vertical * speed * 0.1;
            move.y = Math.sin(angle) * vertical * speed * 0.1;

            physicBody.matter.applyForce(physicBody.body, {x: move.x, y: move.y});
            physicBody.matter.setAngularVelocity(physicBody.body, horizontal * 0.1);

        }

        //this._car?.thrust(vertical * delta * 0.001)
    
        //this._car?.setAngularVelocity(horizontal * 5 * delta * 0.001)


        //const physicBody = this.entity.getComponent(PhysicBody)

    }
}