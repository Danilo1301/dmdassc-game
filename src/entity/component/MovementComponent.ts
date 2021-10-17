import { Entity } from "../Entity";
import { Component } from "./Component";
import { InputHandlerComponent } from "./InputHandlerComponent";
import { PhysicBodyComponent } from "./PhysicBodyComponent";

export class MovementComponent extends Component {

    public entity!: Entity;

    public speed: number = 4;

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

        const move = new Phaser.Math.Vector2(horizontal * speed * delta, vertical * speed * delta);

        if(entity.hasComponent(PhysicBodyComponent)) {

            move.x *= 0.25;
            move.y *= 0.25;

            const physicBody = entity.getComponent(PhysicBodyComponent);
            physicBody.applyForce(Phaser.Math.Vector2.ZERO, move);
        }

        const angle = Phaser.Math.Angle.BetweenPoints(move, {x: 0, y: 0});
        const targetAngle = Phaser.Math.Angle.RotateTo(this.entity.rotation, angle, 0.2)

        if(move.length() > 0) {
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