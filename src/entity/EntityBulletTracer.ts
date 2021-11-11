import { BulletTrace } from "@game/bulletTrace/BulletTrace";
import { Entity } from "@game/entity/Entity";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { World } from "@game/world/World";
import { DebugComponent } from "./component/DebugComponent";
import { HealthComponent } from "./component/HealthComponent";
import { InputHandlerComponent } from "./component/InputHandlerComponent";
import { MovementComponent } from "./component/MovementComponent";
import { PhysicBodyComponent } from "./component/PhysicBodyComponent";
import { PlayerSpriteComponent } from "./component/PlayerSpriteComponent";
import { WeaponComponent } from "./component/WeaponComponent";

export class EntityBulletTracer extends Entity {

    constructor(world: World) {
        super(world);
    }

    public start() {
        super.start();
    }
}


/*
import { BulletTrace } from "@game/bulletTrace/BulletTrace";
import { Entity } from "@game/entity/Entity";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { World } from "@game/world/World";
import { DebugComponent } from "./component/DebugComponent";
import { HealthComponent } from "./component/HealthComponent";
import { InputHandlerComponent } from "./component/InputHandlerComponent";
import { MovementComponent } from "./component/MovementComponent";
import { PhysicBodyComponent } from "./component/PhysicBodyComponent";
import { PlayerSpriteComponent } from "./component/PlayerSpriteComponent";
import { WeaponComponent } from "./component/WeaponComponent";

export class EntityBulletTracer extends Entity {

    constructor(world: World) {
        super(world);

        this.data.hitPosition = {x: 0, y: 0};

        this.addComponent(new DebugComponent());
        
        this.getComponent(DebugComponent).enabled = false;
    }

    public start() {
        super.start();

  
        const byEntity: string = this.data.byEntity;

        
        console.log(byEntity)

        if(byEntity == LocalPlayer.entityId && !this.data.local) {
            
            this.world.removeEntity(this);

            return;
        }

        BulletTrace.spawnTracer(
            new Phaser.Math.Vector2(this.position.x, this.position.y),
            new Phaser.Math.Vector2(this.data.hitPosition.x, this.data.hitPosition.y),
            this.data.color || 0xffff00
        )

        setTimeout(() => this.world.removeEntity(this), 500);
 





        const bodies = new Map<MatterJS.BodyType, Entity>();

        this.world.entities.map(entity => {

            if(entity.id == byEntity) return;

            if(!entity.hasComponent(PhysicBodyComponent)) return;
            const physicBody = entity.getComponent(PhysicBodyComponent);
            if(!physicBody.body) return;
            bodies.set(physicBody.body, entity);
        })


        const r = {x: Math.cos(this.lookRotation), y: Math.sin(this.lookRotation)}

        const ray = BulletTrace.raycast(Array.from(bodies.keys()), this.position, r, 300);

        let entity: Entity | undefined;

        if(ray) {
            entity = bodies.get(ray.body)!;

        }

        if(entity) {
            console.log("aa", entity)

            if(LocalPlayer.entity != undefined) return;

            if(entity.hasComponent(HealthComponent)) {
                entity.getComponent(HealthComponent).takeDamage(17);
            }
        }
    }
    
}

*/