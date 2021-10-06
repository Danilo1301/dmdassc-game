import { EntityWeapon } from "@game/entities/weapon/EntityWeapon";
import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { GameScene } from "@game/scenes/GameScene";
import { EntityDebug } from "./EntityDebug";

export class WeaponComponent extends Component {

    public entity!: Entity;

    private _weaponEntity?: EntityWeapon;

    constructor() {
        super();
    }
    
    public start(): void {
        super.start();

        const scene = GameScene.Instance;

        console.log("nned weapon")

        this._weaponEntity = this.entity.world.spawnEntity('EntityWeapon', {}) as EntityWeapon;
    }

    public update(delta: number): void {
        super.update(delta);

        if(!this._weaponEntity) return;

        this._weaponEntity.position.set(this.entity.position.x, this.entity.position.y);
        this._weaponEntity.position.setAimDirection(this.entity.position.aimDirection)
        this._weaponEntity.position.setDirection(this.entity.position.aimDirection)
        //this._weaponEntity.position.setAimDirection(this.entity.position.aimDirection)
    }

    public takeDamage(amount: number) {

        
    }

    public destroy(): void {
        super.destroy();
    }
}