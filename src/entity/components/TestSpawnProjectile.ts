import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
import { Entity } from "../Entity";
import { InputHandler } from "./InputHandler";
import { PhysicBody } from "./PhysicBody";

export class TestSpawnProjectile extends Component {

    public entity!: Entity;

    public start() {
        super.start();
       
        setInterval(() => {

            const position = new Phaser.Math.Vector2(this.entity.position.x, this.entity.position.y);
            const angle = this.entity.position.direction;

            this.entity.world.spawnProjectile(position, angle);

        }, 500)
    }
}