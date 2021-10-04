import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { Input } from "@game/input/Input";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { EntityDebug } from "./EntityDebug";
import { InputHandler } from "./InputHandler";
import { TestSpawnProjectile } from "./TestSpawnProjectile";

export interface IPlayerData {
    test?: string
    buttonDown?: boolean
}

export class PlayerBehaviour extends Component {

    public entity!: Entity;

    public _test: string = "";

    constructor() {
        super();
    }

    public start(): void {
        super.start();

        this.watchDataKey('test', {});
        this.watchDataKey('buttonDown', {});
    }

    public update(delta: number): void {
        super.update(delta);

        this.entity.getComponent(EntityDebug).setLineText('testpbh', this._test)

        if(!this.entity.hasComponent(InputHandler)) return;

        const inputHandler = this.entity.getComponent(InputHandler);

        if(!inputHandler.isControlledByPlayer) return;

        const pos = {
            x: SceneManager.phaser.scale.gameSize.width/2,
            y: SceneManager.phaser.scale.gameSize.height/2
        }

        const angle = Phaser.Math.Angle.BetweenPoints(Input.mousePosition, pos);

        this.entity.position.setAimDirection(angle + Math.PI);
    }

    

    public destroy(): void {
        super.destroy();

        
        

        //const angle = Phaser.Math.
    }

    public toData() {
        const data: IPlayerData = {
            test: this._test,
            buttonDown: Input.getKeyDown(69)
        }
        return data;
    }

    public fromData(data: IPlayerData) {
        if(data.test !== undefined) {
            this._test = data.test
        }

        if(data.buttonDown !== undefined) {

            this.entity.getComponent(TestSpawnProjectile).enabled = data.buttonDown;
        }
    }
}