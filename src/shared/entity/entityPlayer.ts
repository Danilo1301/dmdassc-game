import { Gameface } from "../../client/gameface";
import { Render } from "../../client/render";
import { CollisionComponent } from "../component/collisionComponent";
import { DebugComponent } from "../component/debugComponent";
import { InputHandlerComponent } from "../component/inputHandlerComponent";
import { PlayerComponent } from "../component/playerComponent";
import { SpriteComponent } from "../component/spriteComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityPlayer extends Entity {
    constructor(world: World) {
        super(world);

        
        //this.addComponent(new DebugComponent());
        this.addComponent(new PlayerComponent());
        this.addComponent(new InputHandlerComponent());

        const sprite = this.addComponent(new SpriteComponent());
        sprite.add('default', 'assets/player.png', 3, 80, 80);

        const collision = this.addComponent(new CollisionComponent());
        collision.options.frictionAir = 0.2;
        collision.addCircle('default', 0, 0, 30);

        Gameface.Instance?.equipGun(this);

        //collision.addRectangle('default', 0, 0, 80, 80);

        /*
        const t = Math.random() * 2000 + 500;

        setInterval(() => {

            const p = this.transform.getPosition();

            Render.createGunFlash(p.x * 0.01, p.y * 0.01);

        }, t);
        */
    }

    public setControllable(value: boolean = true) {
        this.getComponent(InputHandlerComponent).enabled = value;
    }
}