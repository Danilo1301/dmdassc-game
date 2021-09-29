import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
import { Math } from "phaser";
import { Entity } from "../Entity";
import { EntityDebug } from "./EntityDebug";
import { InputHandler } from "./InputHandler";
import { PhysicBody } from "./PhysicBody";

export class TestFollow extends Component {

    public entity!: Entity;

    private _inputHandler?: InputHandler;

    private _followingEntity?: Entity;

    public start() {
        super.start();

        this._inputHandler = this.entity.getComponent(InputHandler);

        setInterval(() => {

            this._followingEntity = this.getRandomEntity();
        }, 8000)
        this._followingEntity = this.getRandomEntity();

    }

    public getRandomEntity() {
        const entities: Entity[] = this.entity.world.entities.filter(e => e != this.entity);
        return entities[Phaser.Math.RND.integerInRange(0, entities.length-1)];
    }

    public update(delta: number) {
        super.update(delta);

        if(!this._inputHandler) return;

        if(this._followingEntity) {

            const angle = Phaser.Math.Angle.BetweenPoints({x: this.entity.position.x, y: this.entity.position.y}, {x: this._followingEntity.position.x, y: this._followingEntity.position.y})
            
            this.entity.getComponent(EntityDebug).setLineText('followangle', `${angle}`);

            this.entity.position.setAngle(angle)

            this._inputHandler.vertical = 1;
        }


    }
}