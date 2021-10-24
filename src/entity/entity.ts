import * as pc from 'playcanvas';
import CANNON from 'cannon';
import { World } from "../world/world";
import Phaser from 'phaser';

export interface IEntityData {
    x?: number
    y?: number
    z?: number
    rx?: number
    ry?: number
    rz?: number
}

export class Entity {
    public dontSync: boolean = false;
    public pcEntity?: pc.Entity;

    private _position = new CANNON.Vec3();
    private _quaternion = new CANNON.Quaternion();

    private _id: string = `${Math.random()}`;
    private _world: World;
    private _body?: CANNON.Body;
    
    public get id() { return this._id; }
    public get body() { return this._body; }

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

    public toJSON() {
        const position = this.getPosition();

        const quat = this.getQuaternion();
        const rotation = new CANNON.Vec3();
        quat.toEuler(rotation);

        const velocity = this.getVelocity();

        const data: IEntityData = {
            x: position.x,
            y: position.y,
            z: position.z,

            rx: rotation.x,
            ry: rotation.y,
            rz: rotation.z,
        }

        return data;
    }

    public fromJSON(data: IEntityData) {
        
        const newPosition = this.getPosition();

        if(data.x !== undefined) newPosition.x = data.x
        if(data.y !== undefined) newPosition.y = data.y
        if(data.z !== undefined) newPosition.z = data.z

        const newRotation = new CANNON.Vec3();
        if(data.rx !== undefined) newRotation.x = data.rx;
        if(data.ry !== undefined) newRotation.y = data.ry;
        if(data.rz !== undefined) newRotation.z = data.rz;

        this.getQuaternion().setFromEuler(newRotation.x, newRotation.y, newRotation.z)


        /*
        const currentQuaternion = this.getQuaternion();
        const newQuaternion = new CANNON.Quaternion();
        newQuaternion.setFromEuler(newRotation.x, newRotation.y, newRotation.z);

        const q1 = new pc.Quat(currentQuaternion.x, currentQuaternion.y, currentQuaternion.z, currentQuaternion.w);
        const q2 = new pc.Quat(newQuaternion.x, newQuaternion.y, newQuaternion.z, newQuaternion.w);
        const q = new pc.Quat().slerp(q1, q2, 1);

        this.getQuaternion().set(q.x, q.y, q.z, q.w)

        */

        
        



        /*
        const currentRotation = new CANNON.Vec3();
        const newRotation = new CANNON.Vec3();
        this.getQuaternion().toEuler(currentRotation);
        this.getQuaternion().toEuler(newRotation);

        if(data.rx !== undefined) newRotation.x = data.rx;
        if(data.ry !== undefined) newRotation.y = data.ry;
        if(data.rz !== undefined) newRotation.z = data.rz;

        currentRotation.lerp(newRotation, 0.1, currentRotation);

        this.body?.quaternion.setFromEuler(newRotation.x, newRotation.y, newRotation.z);
        */

        this.body?.angularVelocity.setZero();
    }
}   