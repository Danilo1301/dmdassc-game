import { Entity } from './entity';
import { World } from '../world/world';
import { PositionComponent } from '../component/positionComponent';
import { CollisionComponent } from '../component/collisionComponent';
import { BuildingSpriteComponent } from '../component/buildingSpriteComponent';
import { TestComponent } from '../component/testComponent';

export class EntityBuilding extends Entity {

    public position: PositionComponent;

    constructor(world: World) {
        super(world);

        this.position = this.addComponent(new PositionComponent());
        
        //const collisionComponent = this.addComponent(new CollisionComponent());
        //collisionComponent.size.set(10, 10)
        

        this.addComponent(new TestComponent());


        if(world.server.game.isClient) {
            this.addComponent(new BuildingSpriteComponent());
        }
    }
}