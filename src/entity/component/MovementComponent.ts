import { Entity } from "../Entity";
import { Component } from "./Component";
import { InputHandlerComponent } from "./InputHandlerComponent";
import { PhysicBodyComponent } from "./PhysicBodyComponent";

export class MovementComponent extends Component {

    public entity!: Entity;

    public speed: number = 4;

    public canChangeRotation: boolean = true;
    public directional: boolean = false;

    constructor() {
        super();

        console.log("wot")
    }

    public start() {
        super.start();
    }

    public update(delta: number) {
        super.update(delta);

        const entity = this.entity;

        if(!this.entity.hasComponent(InputHandlerComponent)) return;

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        const horizontal = inputHandler.horizontal;
        const vertical = inputHandler.vertical;

        const speed = this.speed / 100;

        let move = new Phaser.Math.Vector2(horizontal * speed * delta, vertical * speed * delta);

        if(this.directional) {
            const angle = this.entity.rotation;
            
            move.x = Math.cos(angle) * speed * vertical * delta;
            move.y = Math.sin(angle) * speed * vertical * delta;
        }

        if(entity.hasComponent(PhysicBodyComponent)) {

            move.x *= 0.25;
            move.y *= 0.25;

            const physicBody = entity.getComponent(PhysicBodyComponent);
            physicBody.applyForce(new Phaser.Math.Vector2(this.entity.position.x, this.entity.position.y), move);

            if(this.directional) {
                //fix?
                physicBody.setTorque(0.01 * horizontal * delta);
            }
        }

        const angle = Phaser.Math.Angle.BetweenPoints(move, {x: 0, y: 0});
        const targetAngle = Phaser.Math.Angle.RotateTo(this.entity.rotation, angle, 0.2)

        if(move.length() > 0 && this.canChangeRotation) {
            this.entity.setRotation(targetAngle);
        }


        /*
        entity.setPosition(
            entity.position.x + move.x,
            entity.position.y + move.y
        );
        */
    }
}