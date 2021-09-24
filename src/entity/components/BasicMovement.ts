import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
import { Entity } from "../Entity";
import { PhysicBody } from "./PhysicBody";

export class BasicMovement extends Component {

    public entity!: Entity;

    public speed: number = 2;
    public enabled: boolean = false;

    public update(delta: number) {
        super.update(delta);

        if(!this.enabled) return;

        const horizontal = Input.getHorizontal();
        const vertical = Input.getVertical();

        const entity = this.entity;
        
        const speed = this.speed * 0.01;

        const move = new Phaser.Math.Vector2(horizontal * speed * delta, vertical * speed * delta);

        /*
        entity.position.set(
            entity.position.x + move.x,
            entity.position.y + move.y
        );
        */

        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);



            physicBody.applyForce(Phaser.Math.Vector2.ZERO, move);
        }

        
    }
}