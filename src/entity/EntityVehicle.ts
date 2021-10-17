import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";
import { DebugComponent } from "./component/DebugComponent";
import { HealthComponent } from "./component/HealthComponent";
import { InputHandlerComponent } from "./component/InputHandlerComponent";
import { MovementComponent } from "./component/MovementComponent";
import { PhysicBodyComponent } from "./component/PhysicBodyComponent";
import { PlayerSpriteComponent } from "./component/PlayerSpriteComponent";
import { WeaponComponent } from "./component/WeaponComponent";

export class EntityVehicle extends Entity {

    constructor(world: World) {
        super(world);

        this.setColor(0xffffff);
        this.addComponent(new DebugComponent());
        this.addComponent(new HealthComponent())
        this.addComponent(new InputHandlerComponent());
        
        const movement = <MovementComponent>this.addComponent(new MovementComponent());
        movement.canChangeRotation = false;
        movement.directional = true;
        movement.speed = 20;

        this.addComponent(new PhysicBodyComponent());

        const physicBody = this.getComponent(PhysicBodyComponent);
        physicBody.addRectangle('default', 0, 0, 70, 30);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 500
        })
    }

    public get color() { return this.data.color as number; }

    public setColor(color: number) {
        this.data.color = color;
    }

    public start() {
        super.start();

   
        this.getComponent(InputHandlerComponent).vertical = 1;
        this.getComponent(InputHandlerComponent).horizontal = 0.2;

    }
    
    public update(delta: number) {
        
        const physicBody = this.getComponent(PhysicBodyComponent);
        this.setLookRotation(physicBody.angle)

        super.update(delta);
    }
}
