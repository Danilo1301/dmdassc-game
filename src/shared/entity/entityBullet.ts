import { BulletComponent } from "../component/bulletComponent";
import { CollisionComponent } from "../component/collisionComponent";
import { DebugComponent } from "../component/debugComponent";
import { SpriteComponent } from "../component/spriteComponent";
import { WeaponComponent } from "../component/weaponComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityBullet extends Entity {
    constructor(world: World) {
        super(world);

        //this.syncInterval = 500;

        //this.addComponent(new DebugComponent());
        this.addComponent(new BulletComponent());

        //const sprite = this.addComponent(new SpriteComponent());
        //sprite.add('default', 'assets/bullet.png', 1, 70, 10);

        const collision = this.addComponent(new CollisionComponent());
        collision.options.frictionAir = 0.1;
        collision.options.mass = 10;

        collision.addRectangle('default', 0, 0, 10, 10);
    }
}