import { Entity } from './entity';
import { World } from '../world/world';
import { PositionComponent } from '../component/positionComponent';
import { CollisionComponent } from '../component/collisionComponent';
import { ObjectSpriteComponent } from '../component/objectSpriteComponent';

export class EntityObject extends Entity {

    public position: PositionComponent;

    constructor(world: World) {
        super(world);

        this.position = this.addComponent(new PositionComponent());

        
        
        const collisionComponent = this.addComponent(new CollisionComponent());
        /*
        const s = 100;
        collisionComponent.size.set(s, s);
        collisionComponent.frictionAir = 0.03;
        */

        if(world.server.game.isClient) {
            this.addComponent(new ObjectSpriteComponent());
        }
    }
}