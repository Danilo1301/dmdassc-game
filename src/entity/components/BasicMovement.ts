import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
import { Entity } from "../Entity";
import { InputHandler } from "./InputHandler";
import { PhysicBody } from "./PhysicBody";

export class BasicMovement extends Component {

    public entity!: Entity;

    public speed: number = 1.6;
    public directional: boolean = true;

    private _inputHandler?: InputHandler;

    public start() {
        super.start();

        this._inputHandler = this.entity.getComponent(InputHandler);
    }

    public update(delta: number) {
        super.update(delta);

        if(!this._inputHandler) return;

        const inputHandler = this._inputHandler;

        const horizontal = inputHandler.horizontal;
        const vertical = inputHandler.vertical;

        const entity = this.entity;
        
        const speed = this.speed;

        const move = new Phaser.Math.Vector2(horizontal * speed * delta, vertical * speed * delta);

        if(this.directional) {
            let angle = 0;

            

            if(entity.hasComponent(PhysicBody)) {
                const physicBody = entity.getComponent(PhysicBody);
                angle = physicBody.body.parent.angle;

                const newAngle = angle + horizontal*0.05;
                physicBody.setAngle(newAngle);
            }

            move.x = Math.cos(angle) * vertical * speed;
            move.y = Math.sin(angle) * vertical * speed;

            
        }

        /*
        entity.position.set(
            entity.position.x + move.x,
            entity.position.y + move.y
        );
        */

        if(entity.hasComponent(PhysicBody)) {
            const physicBody = entity.getComponent(PhysicBody);
            physicBody.setVelocity(move);// applyForce(Phaser.Math.Vector2.ZERO, move);
        }

    }
}