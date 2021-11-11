import { Input } from "@game/input/Input";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { Entity } from "../Entity";
import { Component } from "./Component";
import { DebugComponent } from "./DebugComponent";

export class HealthComponent extends Component {

    public entity!: Entity;

    public get health() { return this.entity.data.health as number; }
    public set health(value: number) { this.entity.data.health = value; }

    public get maxHealth() { return this.entity.data.maxHealth as number; }
    public set maxHealth(value: number) { this.entity.data.maxHealth = value; }

    private _healthBarGraphics?: Phaser.GameObjects.Graphics;

    constructor() {
        super();
    }

    public start() {
        super.start();

        this.health = 100;
        this.maxHealth = 100;

        const scene = GameScene.Instance;

        if(scene) {
            this._healthBarGraphics = scene.add.graphics();
            this._healthBarGraphics.setDepth(1000);
        }
    }

    public update(delta: number) {
        super.update(delta);
   
        this.entity.getComponent(DebugComponent).setLineText('health', `${this.health} HP`);

        if(this._healthBarGraphics) {
            this._healthBarGraphics.clear();
            this._healthBarGraphics.fillStyle(0xff0000);
            this._healthBarGraphics.fillRect(0, 0, this.health / this.maxHealth * 40, 4);
            this._healthBarGraphics.setPosition(this.entity.position.x, this.entity.position.y - 20);
        }
    }

    public takeDamage(amount: number) {
        this.health -= amount;

        if(this.health <= 0) {
            this.health = this.maxHealth;

            this.entity.setPosition(0, 0);

        }
    }
    
}