import * as pc from 'playcanvas';
import CANNON, { Vec3 } from 'cannon';
import { World } from "../world/world";

export interface IEntityData {
    pos?: number[]
    rot?: number[]
    input?: number[]
}

export class Entity {
    public dontSync: boolean = false;
    public pcEntity?: pc.Entity;

    public canLerp: boolean = false;

    public color: pc.Color;

    private _position = new CANNON.Vec3();
    private _quaternion = new CANNON.Quaternion();

    private _targetPosition = new CANNON.Vec3();
    private _targetQuaternion = new CANNON.Quaternion();

    private _id: string = `${Math.random()}`;
    private _world: World;
    private _body?: CANNON.Body;
    
    public get id() { return this._id; }
    public get body() { return this._body; }

    public input = {x: 0, y: 0};

    constructor(world: World) {
        this._world = world;
    }

    public setBody(body: CANNON.Body) {
        this._body = body;
    }

    public setId(id: string) {
        this._id = id;
    }

    public getPosition() {
        if(this._body) return this._body.position;
        return this._position;
    }

    public getQuaternion() {
        if(this._body) return this._body.quaternion;
        return this._quaternion;
    }

    public getVelocity() {
        if(this._body) return this._body.velocity;
        return this._quaternion;
    }

    public update(dt: number) {

        const speed = 700;

        const force = new CANNON.Vec3(speed * this.input.x, speed * this.input.y, 0)

        this.body?.applyForce(force, this.getPosition());

        if(this.canLerp) {
            const position = this.getPosition();
            const newPosition = new CANNON.Vec3();

            const distance = position.distanceTo(this._targetPosition);

            let lerpAmount = 0.3;
            if(distance > 2.5) lerpAmount = 1;


            position.lerp(this._targetPosition, lerpAmount, newPosition);
            position.set(newPosition.x, newPosition.y, newPosition.z);
        }

        if(this.canLerp) {
            //this.body?.angularVelocity.setZero();
            //this.getQuaternion().set(this._targetQuaternion.x, this._targetQuaternion.y, this._targetQuaternion.z, this._targetQuaternion.w)
        }

        if(this.getPosition().distanceTo(Vec3.ZERO) > 20) {
            this.getPosition().set(0, 0, 2);
            this.body?.velocity.setZero();
            this.body?.angularVelocity.setZero();
        }



        

    }

    public toJSON() {
        const data: IEntityData = {}

        const position = this.getPosition();
        data.pos = [position.x, position.y, position.z];

        const quat = this.getQuaternion();
        data.rot = [quat.x, quat.y, quat.z, quat.w];

        data.input = [this.input.x, this.input.y];

        return data;
    }

    public fromJSON(data: IEntityData) {
        
        if(data.pos) {
            this._targetPosition.set(data.pos[0], data.pos[1], data.pos[2]);
        }

        if(data.rot) {
            if(this.canLerp) this.getQuaternion().set(data.rot[0], data.rot[1], data.rot[2], data.rot[3]);
        }
        
        if(data.input) {
            this.input.x = data.input[0];
            this.input.y = data.input[1];
        }
    }
}   