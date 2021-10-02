import { EntityProjectile } from "@game/entities/projectile/EntityProjectile";
import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { Health } from "./Health";

export interface IProjectileBehaviourData {
    owner?: string
}

export class ProjectileBehaviour extends Component {

    public entity!: Entity;

    public ownerId: string = "";

    constructor() {
        super();
    }

    public start(): void {
        super.start();

        this.watchDataKey('owner', {});
    }

    public update(delta: number): void {
        super.update(delta);

        for (const entity of this.entity.world.entities) {

            if(entity instanceof EntityProjectile) continue;
            if(this.entity.getComponent(ProjectileBehaviour).ownerId == entity.id) continue;
            
            const distance = Phaser.Math.Distance.BetweenPoints(this.entity.position, entity.position);

            if(distance < 10) {
                this.entity.world.removeEntity(this.entity);

                console.log("hit")

                if(entity.hasComponent(Health)) {
                    const healthComponent = entity.getComponent(Health);

                    healthComponent.health -= 17;

                    if(healthComponent.health <= 0) {
                        healthComponent.health = 100;

                        entity.position.set(0, 0);
                    }
                }
            }
        }
    }

    public destroy(): void {
        super.destroy();
    }

    public toData() {
        const data: IProjectileBehaviourData = {
            owner: this.ownerId
        }
        return data;
    }

    public fromData(data: IProjectileBehaviourData) {
        if(data.owner !== undefined) {
            this.ownerId = data.owner
        }
    }
}