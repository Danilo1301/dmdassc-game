import * as pc from "playcanvas";
import { BaseEntity } from "../entity/baseEntity";
import { Game } from "../game/game";

export class Movement extends pc.ScriptType {

    private force = new pc.Vec3();

    public entity: BaseEntity;

    public controlledByPlayer: boolean = false;
    public horizontal: number = 0;
    public vertical: number = 0;

    public initialize() {
        console.log("[MovementScript] initialize")

        this.fire('initialize');

        var textMeasure = new pc.Entity();
        textMeasure.name = "textMeasure";
        
        textMeasure.addComponent('element', {
            type: pc.ELEMENTTYPE_TEXT ,
            width: 256,
            height: 256,
            fontSize: 24, 
            rect: [0,0,1,0.25],
        });
        
        textMeasure.element!.text = 'helo=========================';
    

        this.entity.addChild(textMeasure);
    }


    public update(dt) {
        this.fire('update', dt);


        let forceY = 0;

        if(this.controlledByPlayer) {
            this.horizontal = 0;
            this.vertical = 0;


            if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
                this.horizontal = -1;
            } 

            if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
                this.horizontal += 1;
            }

            if (this.app.keyboard.isPressed(pc.KEY_UP)) {
                this.vertical = -1;
            } 

            if (this.app.keyboard.isPressed(pc.KEY_DOWN)) {
                this.vertical += 1;
            }

            if (this.app.keyboard.isPressed(pc.KEY_SPACE)) {
                forceY += 0.2;
            }
        }

    
        const speed = 0.1;

        

        this.force.x = this.horizontal * speed;
        this.force.y = 0;
        this.force.z = this.vertical * speed;

      
        if (this.force.length()) {

            /*
            var rX = Math.cos(-Math.PI * 0.25);
            var rY = Math.sin(-Math.PI * 0.25);
            */
            
            var rX = Math.cos(0);
            var rY = Math.sin(0);
            
            this.force.set(this.force.x * rX - this.force.z * rY, 0, this.force.z * rX + this.force.x * rY);

            if (this.force.length() > speed) {
                this.force.normalize().mulScalar(speed);
            }
        }

        this.force.y = forceY;
        //this.force.y = this.entity.rigidbody!.linearVelocity.y;

        //this.entity.setVelocity(this.force)
        var relativePoint = new pc.Vec3(0, 0, 0);
        this.entity.rigidbody!.applyImpulse(this.force, relativePoint);

        if(this.entity.getPosition().y < -5) {
            this.entity.teleport(new pc.Vec3(0, 3, 0));
            this.entity.setVelocity(pc.Vec3.ZERO)
        }
    }

    public postUpdate(dt) {
        this.fire('postUpdate', dt);

        if(!Game.isHeadless) {
            var start = new pc.Vec3(0, 1, 0);
            var end = this.entity.getPosition();
            this.app.drawLine(start, end, pc.Color.RED, true);
            //this.app.drawLine(start, end, pc.Color.RED, false);
        }
    }

}
