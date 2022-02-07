import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { Component } from "./component";

enum BodyType {
    RECTANGLE,
    CIRCLE
}

class BodyPart {
    public key: string
    public type: BodyType
    public x: number
    public y: number

    public width: number = 0
    public height: number = 0

    public radius: number = 0

    public sensor: boolean = false;

    public body?: Matter.Body

    constructor(key: string, x: number, y: number, type: BodyType) {
        this.key = key
        this.x = x
        this.y = y
        this.type = type
    }
}


export class CollisionComponent extends Component {
    public entity: Entity;
    public priority: number = 980;

    public options: Matter.IChamferableBodyDefinition = {mass: 20, friction: 0.001, frictionAir: 0.3 };

    public get body() { return this._body; }

    private _body: Matter.Body;
    private _bodyParts = new Map<string, BodyPart>();

    public applyForce(x: number, y: number) {
        const body = this.body;

        if(!body) return;

        const position = body.position;

        Matter.Body.applyForce(body, position, {x: x, y: y});
    }

    public init() {
        super.init();

        this.createBody();
    }

    public update(dt: number) {
        super.update(dt);

        const body = this.body;

        if(body) {
            this.entity.transform.data.x = body.position.x;
            this.entity.transform.data.y = body.position.y;
            this.entity.transform.data.velX = body.velocity.x;
            this.entity.transform.data.velY = body.velocity.y;
            this.entity.transform.data.angle = body.angle;
        }
    }

    public preupdate(dt: number) {
        super.preupdate(dt);
        
        const body = this.body;

        if(body) {
            Matter.Body.setPosition(body, {
                x: this.entity.transform.data.x,
                y: this.entity.transform.data.y
            });
            Matter.Body.setVelocity(body,  {
                x: this.entity.transform.data.velX,
                y: this.entity.transform.data.velY
            });
            Matter.Body.setAngle(body, this.entity.transform.data.angle);
        }

    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }

    private createBody() {

        const matterWorld = this.entity.world.matter.world!;
        const options = Object.assign({}, this.options);
        const parts: Matter.Body[] = [];


        for (const bodyPart of this._bodyParts.values()) {
            
            options.isSensor = bodyPart.sensor;
            if(bodyPart.type == BodyType.RECTANGLE) bodyPart.body = Matter.Bodies.rectangle(bodyPart.x, bodyPart.y, bodyPart.width, bodyPart.height, options)
            if(bodyPart.type == BodyType.CIRCLE) bodyPart.body = Matter.Bodies.circle(bodyPart.x, bodyPart.y, bodyPart.radius, options)

            parts.push(bodyPart.body!)
        }

        options.isSensor = false;
        options.parts = parts
        
        const body = Matter.Body.create(options);

        Matter.Body.setCentre(body, {x: 0, y: 0});

        Matter.Composite.add(matterWorld, body);
      
        this._body = body;
    }

    public getBodyPart(key: string) {
        return this._bodyParts.get(key);
    }

    public addRectangle(key: string, x: number, y: number, width: number, height: number, sensor: boolean = false): BodyPart {
        var bodyPart = new BodyPart(key, x, y, BodyType.RECTANGLE)

        bodyPart.width = width
        bodyPart.height = height
        bodyPart.sensor = sensor;

        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }

    public addCircle(key: string, x: number, y: number, radius: number): BodyPart {
        var bodyPart = new BodyPart(key, x, y, BodyType.CIRCLE)

        bodyPart.radius = radius
  
        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }
}