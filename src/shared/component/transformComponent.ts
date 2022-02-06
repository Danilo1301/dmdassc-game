import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { Component } from "./component";

export class TransformComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);
    }

   
    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}