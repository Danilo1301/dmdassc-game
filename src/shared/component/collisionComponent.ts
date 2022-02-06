import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { Component } from "./component";

export class CollisionComponent extends Component {
    public entity: Entity;
    public priority: number = 990;

    public body?: Matter.Body;

    public applyForce(x: number, y: number) {
        const body = this.body;

        if(!body) return;

        const position = body.position;

        Matter.Body.applyForce(body, position, {x: x, y: y});
    }

    public init() {
        super.init();

        //this.createBody();
    }

    public update(dt: number) {
        super.update(dt);

        const body = this.body;

        if(body) {
            this.entity.transform.data.x = body.position.x;
            this.entity.transform.data.y = body.position.y;
            this.entity.transform.data.velX = body.velocity.x;
            this.entity.transform.data.velY = body.velocity.y;
        }
    }

    public preupdate(dt: number) {
        super.preupdate(dt);
        
        const body = this.body;

        if(body) {
            Matter.Body.setPosition(body, this.entity.transform.getPosition());
            Matter.Body.setVelocity(body, this.entity.transform.getVelocity());
        }

    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }

    private createBody() {
        const matterWorld = this.entity.world.matter.world!;
        const body = Matter.Bodies.circle(0, 0, 25);

        Matter.Composite.add(matterWorld, body);

        Matter.Body.setPosition(body, {x: Math.random()*100, y: Math.random()*100})

        setInterval(() => {

            Matter.Body.setVelocity(body, {x: Math.random()-0.5, y: Math.random()})

        }, Math.random()*8000)

        this.body = body
    }
}