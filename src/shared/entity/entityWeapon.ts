import { CollisionComponent } from "../component/collisionComponent";
import { DebugComponent } from "../component/debugComponent";
import { SpriteComponent } from "../component/spriteComponent";
import { WeaponComponent } from "../component/weaponComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityWeapon extends Entity {
    constructor(world: World) {
        super(world);

        this.canSync = false;

        //this.addComponent(new DebugComponent());
        this.addComponent(new WeaponComponent());

        const sprite = this.addComponent(new SpriteComponent());
        sprite.add('default', 'assets/car.png', 1, 60, 8);

        const collision = this.addComponent(new CollisionComponent());
        collision.options.frictionAir = 0.1;
        collision.options.mass = 100000;

        collision.addRectangle('default', 0, 0, 70, 10, true);
        collision.addRectangle('muzzle', 35, 0, 5, 5, true);
    }
}