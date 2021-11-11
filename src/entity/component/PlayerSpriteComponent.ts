import { GameScene } from "@game/scenes/GameScene";
import { Entity } from "../Entity";
import { Component } from "./Component";
import { DebugComponent } from "./DebugComponent";
import { InputHandlerComponent } from "./InputHandlerComponent";
import { PhysicBodyComponent } from "./PhysicBodyComponent";

export class PlayerSpriteComponent extends Component {

    public entity!: Entity;

    private _sprite?: Phaser.GameObjects.Sprite;
    private _frame: number = 0;
    private _frameChangeTime: number = 0;

    public isWalking: boolean = false;

    constructor() {
        super();
    }

    public start() {
        super.start();

        if(GameScene.Instance) {
            this._sprite = this.entity.world.scene.add.sprite(0, 0, 'player');
            this._sprite.setScale(0.3);

            const w = this._sprite.texture.getSourceImage().width/3;
            const h = this._sprite.texture.getSourceImage().height;

            for (let i = 0; i < 3; i++) {
                this._sprite.texture.add(i, 0, i*w, 0, w, h);
            }
        }


    }

    public update(delta: number) {
        super.update(delta);

        const entity = this.entity;
        const sprite = this._sprite;

        if(entity.hasComponent(InputHandlerComponent)) {
            const inputHandler = entity.getComponent(InputHandlerComponent);

            const vec = new Phaser.Math.Vector2(inputHandler.horizontal, inputHandler.vertical);

            this.isWalking = vec.length() > 0;
        }
        
        if(!sprite) return;

        
        this._frameChangeTime += delta;
        if(this._frameChangeTime >= 200) {
            this._frameChangeTime = 0;
            this._frame++;

            if(this._frame >= 2) {
                this._frame = 0;
            }
        }

        this.entity.getComponent(DebugComponent).setLineText('test1', `${this._frame}`)

        sprite.setFrame(this.isWalking ? this._frame+1 : 0);
        sprite.setPosition(entity.position.x, entity.position.y);
        sprite.setAngle(Phaser.Math.RadToDeg(entity.rotation) + 90);

        /*
        entity.setPosition(
            entity.position.x + move.x,
            entity.position.y + move.y
        );
        */
    }
}