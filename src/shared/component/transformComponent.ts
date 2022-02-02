import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { SyncComponent } from './syncComponent';

export class TransformComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public get angle() { return this.entity.data.getKey('angle') as number; };
    public set angle(value: number) { this.entity.data.setKey('angle', value); };
    public velocity = new pc.Vec2();

    public init() {
        super.init();

        this.entity.data.defineKey("position.x", {minDifference: 0.1});
        this.entity.data.defineKey("position.y", {minDifference: 0.1});
        this.entity.data.defineKey("angle", {minDifference: 0.01});
 
        
        console.log("data on init", this.entity.data['_data'])

        //console.log(this.entity.data.getKey("position.x"));

        //const positionAbc = this.entity.data.getObject("position.abc");


        //const test = this.entity.data.getObject("test");

    }

    public update(dt: number) {
        super.update(dt);

        this.handleCollisionComponent();
    }

    public getPosition() {
        return new pc.Vec2(
            this.entity.data.getKey('position.x'),
            this.entity.data.getKey('position.y')
        )
    }

    public setPosition(x: number, y: number) {
        this.entity.data.setKey('position.x', x);
        this.entity.data.setKey('position.y', y);

        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            c.setPosition(x, y);
        }
    }

    public setVelocity(x: number, y: number) {
        this.velocity.x = x;
        this.velocity.y = y;

        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            c.setVelocity(this.velocity.x, this.velocity.y);
        }
    }
    
    public setAngle(angle: number) {
        this.angle = angle;

        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            Matter.Body.setAngle(c.body, this.angle);
        }
    }

    public setAngularVelocity(velocity: number) {
        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            Matter.Body.setAngularVelocity(c.body, velocity);
        }
    }

    private handleCollisionComponent() {
        if(this.entity.hasComponent(CollisionComponent)) {
            
            const c = this.entity.getComponent(CollisionComponent);

            const pos = {
                x: c.body.position.x * 1,
                y: c.body.position.y * 1
            };

            this.setPosition(pos.x, pos.y);
            
            this.velocity.x = c.body.velocity.x * 1;
            this.velocity.y = c.body.velocity.y * 1;
            this.angle = c.body.angle;
        }
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }

    /*
    public serialize(packet: Packet): any {
        return packet;
    }

    public unserialize(packet: Packet): any {
        const x = packet.readDouble();
        const y = packet.readDouble();
        const velX = packet.readDouble();
        const velY = packet.readDouble();
        const angle = packet.readDouble();

        //console.log('unserialzied', x, y);
        
        if(this.entity.hasComponent(SyncComponent)) {
            this.entity.getComponent(SyncComponent).setPosition(x, y);
            this.entity.getComponent(SyncComponent).setAngle(angle);
            this.entity.getComponent(SyncComponent).setVelocity(velX, velY);
        } else {
            this.setPosition(x, y);
            this.setAngle(angle);
        }

        return packet;
    }
    */
}