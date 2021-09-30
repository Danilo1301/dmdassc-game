import { Component } from "@game/entity/Component"
import { Input } from "@game/input/Input";
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
        }, Math.random() * 3000 + 7000)
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

            const angle = this.entity.position.direction;
            
            const pos1 = {x: this.entity.position.x, y: this.entity.position.y};
            const pos2 = {x: this._followingEntity.position.x, y: this._followingEntity.position.y};

            const targetAngle = Phaser.Math.Angle.BetweenPoints(pos1, pos2);

            //const targetAngle = Math.PI/2 + Phaser.Math.Angle.BetweenPoints({x: this.entity.position.x, y: this.entity.position.y}, {x: this._followingEntity.position.x, y: this._followingEntity.position.y})

            //console.log(angle, targetAngle);

            const newAngle = Phaser.Math.Angle.RotateTo(angle, targetAngle, 0.1)

            
            this.entity.getComponent(EntityDebug).setLineText('followangle', `${newAngle}`);

            this.entity.position.setDirection(newAngle)

            this._inputHandler.vertical = 1;
        }


    }
}