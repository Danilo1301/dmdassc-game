import * as pc from 'playcanvas';
import { Entity } from "./entity";
import CANNON from 'cannon';

export class EntityPlayer extends Entity {

    constructor(world) {
        super(world);

        this.setColor(new pc.Color(Math.random(), Math.random(), Math.random()))
    }


    public setBody(body: CANNON.Body) {
        body.fixedRotation = true;
        body.updateMassProperties();

        super.setBody(body);
    }

    public update(dt: number) {
        super.update(dt);

        const speed = 200;

        const force = new CANNON.Vec3(
            speed * this.input.horizontal * dt,
            speed * this.input.vertical * dt,
            0
        );


        const velocity = this.velocity;
        velocity.set(force.x, force.y, velocity.z);

        //this.body?.applyLocalForce(new CANNON.Vec3(0, 0, -1000), CANNON.Vec3.ZERO);
    }

    public init() {
        super.init();

        const s = 0.3;

        const body = this.world.createRectangleBody(
            this.position,
            new CANNON.Vec3(s,s,s),
            {mass: 100, material: this.world._material_test}
        );

        this.setBody(body);
    }
}