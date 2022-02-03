import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Render } from '../../client/render';
import { EntityBullet } from '../entity/entityBullet';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { InputHandlerComponent } from './inputHandlerComponent';

export class WeaponComponent extends Component {
    public speed: number = 40;
    public enabled: boolean = false;

    public init() {
        super.init();

        setInterval(() => {

            
            
            const collisionComponent = this.entity.getComponent(CollisionComponent);
            const bodyPart = collisionComponent.getBodyPart("muzzle");
            
            const p = bodyPart!.Body!.position
            
            console.log(bodyPart)

            
                Render.createGunFlash(p.x * 0.01, p.y * 0.01);

                if(this.enabled) {
                    const bullet = this.entity.world.spawnEntity(EntityBullet);

                    bullet.transform.setPosition(p.x, p.y);
                    bullet.transform.setAngle(this.entity.transform.angle);

                }

        }, 2000);
    }


    public update(dt: number) {
        super.update(dt);

        if(!this.entity.hasComponent(InputHandlerComponent)) return;

        
    }
}