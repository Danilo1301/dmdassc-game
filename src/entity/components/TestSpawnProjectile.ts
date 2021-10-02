import { Component } from "@game/entity/Component"
import { Entity } from "../Entity";
import { ProjectileBehaviour } from "./ProjectileBehaviour";

export class TestSpawnProjectile extends Component {

    public entity!: Entity;

    public enabled: boolean = false;

    private _lastShot: number = 0;

    public start() {
        super.start();
    }

    public update(delta: number) {
        super.update(delta);

        if(!this.enabled) return;

        const now = Date.now();

        if(now - this._lastShot >= 500) {
            this._lastShot = now;

            this.spawnProjectile();
        }
    }

    public spawnProjectile() {
        const position = new Phaser.Math.Vector2(this.entity.position.x, this.entity.position.y);
        const angle = this.entity.position.aimDirection;

        const projectile = this.entity.world.spawnProjectile(position, angle);
        projectile.getComponent(ProjectileBehaviour).ownerId = this.entity.id;
    }
}