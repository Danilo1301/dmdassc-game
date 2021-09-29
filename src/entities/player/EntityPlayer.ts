import { BasicMovement } from "@game/entity/components/BasicMovement";
import { InputHandler } from "@game/entity/components/InputHandler";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { TestSprite } from "@game/entity/components/TestSprite";
import { Entity } from "@game/entity/Entity";
import { GameClient } from "@game/game/GameClient";
import { Input } from "@game/input/Input";
import { IPacketData_Id, PacketType } from "@game/network/Packet";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { World } from "@game/world/World";
import { EntityVehicle } from "../vehicle/EntityVehicle";


export class EntityPlayer extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody());
        this.addComponent(new InputHandler());
        this.addComponent(new BasicMovement());

        this.addComponent(new TestSprite());
        this.getComponent(TestSprite).texturename = `player_test`;
        

        const physicBody = this.getComponent(PhysicBody);
        physicBody.addCircle('default', 0, 0, 10);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 100,
            inertia: Infinity
        })
    }


}
