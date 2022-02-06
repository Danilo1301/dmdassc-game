import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";

export interface IPlayerComponent_Data {
    name: string
    color: number
}

export class PlayerComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public data: IPlayerComponent_Data = {
        name: 'no name',
        color: 16
    }
    
    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);
    }
}