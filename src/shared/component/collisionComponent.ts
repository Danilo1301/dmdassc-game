import { Entity } from "../entity/entity";
import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Component } from "./component";
import { Render } from "../../client/gameface/render";

class BodyPart {
    public Key: string
    public Type: BodyType
    public X: number
    public Y: number

    public Width: number = 0
    public Height: number = 0

    public Radius: number = 0

    public Body?: Matter.Body

    constructor(key: string, x: number, y: number, type: BodyType) {
        this.Key = key
        this.X = x
        this.Y = y
        this.Type = type
    }
}

enum BodyType {
    RECTANGLE,
    CIRCLE
}

export class CollisionComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    public get body() { return this._body!; }

    public options: Matter.IChamferableBodyDefinition = {mass: 20, friction: 0.001, frictionAir: 0.3 };

    private _body?: Matter.Body;

    private _bodyParts = new Map<string, BodyPart>();

    public init() {
        console.log("colision init")
        super.init();

        this.createBody();

        //const body = this._body = Matter.Bodies.rectangle(0, 0, 100, 100, this.options);
        //Matter.Composite.add(this.entity.world.matter.world!, body);
    }

    private createBody() {
        const options = Object.assign({}, this.options);
        const parts: Matter.Body[] = [];
        const matterWorld = this.entity.world.matter.world!;

        for (const bodyPart of this._bodyParts.values()) {
            if(bodyPart.Type == BodyType.RECTANGLE) bodyPart.Body = Matter.Bodies.rectangle(bodyPart.X, bodyPart.Y, bodyPart.Width, bodyPart.Height, options)
            if(bodyPart.Type == BodyType.CIRCLE) bodyPart.Body = Matter.Bodies.circle(bodyPart.X, bodyPart.Y, bodyPart.Radius, options)

            parts.push(bodyPart.Body!)
        }

        options.parts = parts
        
        var body = Matter.Body.create(options);

        Matter.Composite.add(matterWorld, body);
        //matter.world.add(body)

        this._body = body;

        //this.setPosition(this.entity.transform.position.x, this.entity.transform.position.y)
    }

    public update(dt: number) {
        super.update(dt);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }

    public getBodyPart(key: string) {
        return this._bodyParts.get(key);
    }

    public addRectangle(key: string, x: number, y: number, width: number, height: number): BodyPart {
        var bodyPart = new BodyPart(key, x, y, BodyType.RECTANGLE)

        bodyPart.Width = width
        bodyPart.Height = height

        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }

    public addCircle(key: string, x: number, y: number, radius: number): BodyPart {
        var bodyPart = new BodyPart(key, x, y, BodyType.CIRCLE)

        bodyPart.Radius = radius
  
        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }

    public setPosition(x: number, y: number) {
        var body = this.body;
        Matter.Body.setPosition(body, {x: x, y: y});
    }

    public setVelocity(x: number, y: number) {
        var body = this.body;
        Matter.Body.setVelocity(body, {x: x, y: y});
    }

    public destroy(): void {
        super.destroy();
        
        const matterWorld = this.entity.world.matter.world!;
        Matter.Composite.remove(matterWorld, this.body);
    }
}

/*
xport class CollisionComponent extends Component {
    private _body: Matter.Body;

    public get body() { return this._body; }

    public size = new pc.Vec2(10, 10);
    public frictionAir: number = 0.2;

    public init() {
        super.init();

        const body = this._body = Matter.Bodies.rectangle(0, 0, this.size.x * 10, this.size.y * 10, { friction: 0.001, frictionAir: this.frictionAir });
        Matter.Composite.add(this.entity.world.matterWorld, body);
    }

    public update(dt: number) {
        super.update(dt);
    }
}
*/