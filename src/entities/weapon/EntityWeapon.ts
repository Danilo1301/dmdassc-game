import { BulletTrace } from "@game/bulletTrace/BulletTrace";
import { TestSprite } from "@game/entity/components/TestSprite";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";

interface IEntityData {
    color: number
}

export class EntityWeapon extends Entity {

    public entityData: IEntityData = {
        color: 0xff0000
    }

    constructor(world: World) {
        super(world);
        
        this.addComponent(new TestSprite());
        this.getComponent(TestSprite).texturename = `crate`;

        this.dontSync = true;

        setInterval(() => {
            //this.shoot();
        }, 500)
    }

    public shoot() {
        const Matter: any = Phaser.Physics.Matter['Matter'];
        const angle = this.position.aimDirection

        const start = new Phaser.Math.Vector2(this.position.x, this.position.y);

        const r = new Matter.Vector.create( Math.cos(angle), Math.sin(angle) );
        const normRay = Matter.Vector.normalise(r);

        let end = Matter.Vector.mult(normRay, 300);
        end = Matter.Vector.add(start, end);

        BulletTrace.spawnTracer(start, new Phaser.Math.Vector2(end.x, end.y))
    }
}
