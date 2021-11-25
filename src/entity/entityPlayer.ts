import { Entity } from './entity';
import { World } from '../world/world';
import { PositionComponent } from '../component/positionComponent';
import { CollisionComponent } from '../component/collisionComponent';
import { InputHandlerComponent } from '../component/inputHandlerComponent';
import { TestAnimSpriteComponent } from '../component/testAnimSprite';
import { PlayerComponent } from '../component/playerComponent';

export class EntityPlayer extends Entity {

    public position: PositionComponent;

    constructor(world: World) {
        super(world);

        this.position = this.addComponent(new PositionComponent());
        this.addComponent(new CollisionComponent());
        
        this.addComponent(new InputHandlerComponent());
        this.addComponent(new PlayerComponent());
        
        if(world.server.game.isClient) {
            this.addComponent(new TestAnimSpriteComponent());
        }
    }
}