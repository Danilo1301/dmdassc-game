import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { Gameface } from '../gameface/gameface';
import { Packet } from '../packet/packet';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { SyncComponent } from './syncComponent';

export class TransformComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public get angle() { return this._angle; };
    public position = new pc.Vec2();
    
    private _angle: number = 0;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        this.handleCollisionComponent();
    }

    public setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;

        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            c.setPosition(this.position.x, this.position.y);
        }
    }
    
    public setAngle(angle: number) {
        this._angle = angle;

        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);
            Matter.Body.setAngle(c.body, this._angle);
        }
    }

    private handleCollisionComponent() {
        if(this.entity.hasComponent(CollisionComponent)) {
            const c = this.entity.getComponent(CollisionComponent);

            this.position.x = c.body.position.x * 1;
            this.position.y = c.body.position.y * 1;
            this._angle = c.body.angle;
        }
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }

    public serialize(packet: Packet): any {
        packet.writeDouble(this.position.x);
        packet.writeDouble(this.position.y);
        packet.writeDouble(this.angle); //change
        return packet;
    }

    public unserialize(packet: Packet): any {
        const x = packet.readDouble();
        const y = packet.readDouble();
        const angle = packet.readDouble();

        //console.log('unserialzied', x, y);
        
        if(this.entity.hasComponent(SyncComponent)) {
            this.entity.getComponent(SyncComponent).setPosition(x, y);
            this.entity.getComponent(SyncComponent).setAngle(angle);
        } else {
            this.setPosition(x, y);
            this.setAngle(angle);
        }

        return packet;
    }
}