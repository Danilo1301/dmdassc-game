import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { GameScene } from "@game/scenes/GameScene";
import { PhysicBody } from "./PhysicBody";
import { Position } from "./Position";

export class TestSprite extends Component {

    public entity!: Entity;

    private _sprite?: Phaser.GameObjects.Sprite;

    public texturename: string = "";

    constructor() {
        super();

        this.priority = 1000;
    }

    public start(): void {
        super.start();

        if(GameScene.Instance) {
            this._sprite = GameScene.Instance.add.sprite(0, 0, this.texturename);
            ///this._sprite.setScale(0.3);
        }
        
    }

    public update(delta: number): void {
        super.update(delta);

        const position = this.entity.position;
        const sprite = this._sprite;

        if(!position) return;
        if(!sprite) return;
        
        sprite.setPosition(position.x, position.y)

        if(this.entity.hasComponent(PhysicBody)) {
            const physicBody = this.entity.getComponent(PhysicBody);

            sprite.setAngle(Phaser.Math.RadToDeg(physicBody.body.parent.angle))
        }

        
    }

    public destroy(): void {
        super.destroy();

        this._sprite?.destroy();
    }
}