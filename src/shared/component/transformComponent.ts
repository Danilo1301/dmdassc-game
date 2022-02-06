import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";

export class TransformComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public collisionComponent?: CollisionComponent;
    
    public init() {
        super.init();

        this.collisionComponent = this.entity.getComponent(CollisionComponent);
    }

    public update(dt: number) {
        super.update(dt);
    }

   
    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}