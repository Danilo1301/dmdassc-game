import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { Input } from "@game/input/Input";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { EntityDebug } from "./EntityDebug";
import { InputHandler } from "./InputHandler";
import { TestSpawnProjectile } from "./TestSpawnProjectile";

export interface IHealthData {
    health?: number
}

export class Health extends Component {

    public entity!: Entity;

    private _maxHealth: number = 100;
    private _health: number = 100;
    private _healthBarGraphics?: Phaser.GameObjects.Graphics;

    constructor() {
        super();

        this.watchDataKey('health', {minDifference: 0.01});
    }
    
    public get health() { return this._health; }
    public set health(value: number) { this._health = value; }

    public start(): void {
        super.start();

        const scene = GameScene.Instance;

        if(scene) {
            this._healthBarGraphics = scene.add.graphics();
            this._healthBarGraphics.setDepth(1000);
        }
    }

    public update(delta: number): void {
        super.update(delta);

        this.entity.getComponent(EntityDebug).setLineText('health', `${this.health} HP`);

        if(this._healthBarGraphics) {
            this._healthBarGraphics.clear();
            this._healthBarGraphics.fillStyle(0xff0000);
            this._healthBarGraphics.fillRect(0, 0, this._health / this._maxHealth * 40, 4);
            this._healthBarGraphics.setPosition(this.entity.position.x, this.entity.position.y - 20);
        }
    }

    public destroy(): void {
        super.destroy();
    }

    public toData() {
        const data: IHealthData = {
            health: this._health
        }
        return data;
    }

    public fromData(data: IHealthData) {
        if(data.health !== undefined) {
            this._health = data.health;
        }
    }
}