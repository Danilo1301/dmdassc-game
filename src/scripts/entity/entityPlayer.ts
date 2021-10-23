import * as pc from "../../playcanvas";
import { Movement } from "../scripts/movement";
import { World } from "../world/world";
import { BaseEntity } from "./baseEntity";

export class EntityPlayer extends BaseEntity {
    constructor(name) {
        super(name);
    }

    public init() {
        super.init();

        this.addMovement();
        this.createBody();
    }

    public addMovement() {
        const entity = this;
        let script = entity.findComponent('script') as pc.ScriptComponent | undefined;
        if(!script) script = entity.addComponent('script') as pc.ScriptComponent;
        script.create('movement');
    }

    public setControllable() {
        var m = this.script!.get('movement')! as Movement;
        m.controlledByPlayer = true;
    }

    public createBody() {
        const s = 0.2;
        const size = new pc.Vec3(s,s,s);
     
        const entity = this;
        entity.setPosition(0, 2, 0);
        
        World.createRectangleAtEntity(entity, size, true, new pc.Color(1, 1, 1));

        //entity.rigidbody!['body'].setAngularFactor(0, 1, 0)
    }
}