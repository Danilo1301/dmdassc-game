import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { Component } from "./component";

export class CollisionComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public body: Matter.Body;

    public init() {
        super.init();

        this.createBody();
    }

    public update(dt: number) {
        super.update(dt);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }

    private createBody() {
        const matterWorld = this.entity.world.matter.world!;
        const body = Matter.Bodies.circle(0, 0, 25);

        Matter.Composite.add(matterWorld, body);

        Matter.Body.setPosition(body, {x: Math.random()*100, y: Math.random()*100})
    }
}