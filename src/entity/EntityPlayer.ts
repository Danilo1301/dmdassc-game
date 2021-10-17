import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";
import { DebugComponent } from "./component/DebugComponent";
import { HealthComponent } from "./component/HealthComponent";
import { InputHandlerComponent } from "./component/InputHandlerComponent";
import { MovementComponent } from "./component/MovementComponent";
import { PhysicBodyComponent } from "./component/PhysicBodyComponent";
import { PlayerSpriteComponent } from "./component/PlayerSpriteComponent";
import { WeaponComponent } from "./component/WeaponComponent";

export class EntityPlayer extends Entity {

    constructor(world: World) {
        super(world);

        this.setColor(0xffffff);
        this.addComponent(new DebugComponent());
        this.addComponent(new HealthComponent())
        this.addComponent(new InputHandlerComponent());
        this.addComponent(new MovementComponent());
        this.addComponent(new PhysicBodyComponent());
        this.addComponent(new PlayerSpriteComponent());
        this.addComponent(new WeaponComponent());

        const physicBody = this.getComponent(PhysicBodyComponent);
        physicBody.addCircle('default', 0, 0, 10);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 100,
            inertia: Infinity
        })
    }

    public get color() { return this.data.color as number; }

    public setColor(color: number) {
        this.data.color = color;
    }
    
}
