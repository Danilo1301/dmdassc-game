import { Entity } from './entity';
import { World } from '../world/world';
import { PositionComponent } from '../component/positionComponent';
import { CollisionComponent } from '../component/collisionComponent';
import { InputHandlerComponent } from '../component/inputHandlerComponent';
import { VehicleSpriteComponent } from '../component/vehicleSpriteComponent';
import { VehicleComponent } from '../component/vehicleComponent';
export class EntityVehicle extends Entity {

    public position: PositionComponent;

    constructor(world: World) {
        super(world);

        this.position = this.addComponent(new PositionComponent());
        
        this.addComponent(new InputHandlerComponent());
        this.addComponent(new VehicleComponent());
        
        const collisionComponent = this.addComponent(new CollisionComponent());
        //collisionComponent.size.set(100, 45);
        //collisionComponent.frictionAir = 0.4;
        
        if(world.server.game.isClient) {
            this.addComponent(new VehicleSpriteComponent());
        }
    }
}