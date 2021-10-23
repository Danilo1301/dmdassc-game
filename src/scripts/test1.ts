import * as pc from "playcanvas";
import { Game } from "./game/game";

export class Test1 {
    public static app: pc.Application;

    public static createPlayer(color: pc.Color, controllable?: boolean) {
        const player = this.createRectangle('player', new pc.Vec3(0, 1.5, 0), new pc.Vec3(0.2, 0.2, 0.2), 'dynamic', color);

        let Ammo = window['Ammo'];

        player.rigidbody!['body'].setAngularFactor(new Ammo.btVector3(0, 0, 0))

        const script = <pc.ScriptComponent>player.addComponent("script");
        script.create("testScript", {attributes: {
            attribute1: 163
        }});

        if(controllable)
            script.create("movement")

        var position = player.getPosition();
        //var rotation = new pc.Vec3(Math.random()*90, Math.random()*90, Math.random()*90);
        //player.rigidbody!.teleport(position, rotation)

        return player;
    }
    
    public static run(app: pc.Application) {
        Test1.app = app;

        pc.registerScript(TestScript, 'testScript', app);
        pc.registerScript(MovementScript, 'movement', app);
        
        window['app'] = app;

        /*
        window['player'] = this.createPlayer();
      
        const floor = new pc.Entity('cube');
        
        
        floor.addComponent('model', {
            type: 'box',
        });
        floor.addComponent('rigidbody', {
            type: 'static'
        });
        floor.addComponent('collision', {
            type: 'box',
        });


        app.root.addChild(floor);
        */

        this.createRectangle('floor', new pc.Vec3(0, 0, 0), new pc.Vec3(10, 0.1, 10), 'static', new pc.Color());
        
        /*
        const player = this.createPlayer(true);
        this.createPlayer();
        this.createPlayer();
        this.createPlayer();
        */

        
        // create camera entity

        
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 0.8, 3);
        
        setInterval(() => {
            //camera.lookAt(player.getPosition())
        }, 1)

        // create directional light entity
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(20, 0, 0);
        //light.setPosition(0, 0, 0)

        

        // rotate the box according to the delta time since the last frame

        app.on('initialize', () => {

          
            //console.log(box.findComponent('onScreenJoystick') ? 'found' : 'not yet')
            
        })

        app.on('update', dt => {

            //console.log(box.findComponent('onScreenJoystick') != undefined ? 'exists' : "no")
            //console.log(a)

            //box.rotate(10 * dt, 0, 0)

            //console.log(box.getRotation().x)
        });
    }

    public static createRectangle(name: string, position: pc.Vec3, size: pc.Vec3, rigidbodyType: string, color: pc.Color) {
        const entity = new pc.Entity(name);
        entity.setPosition(position)

        entity.addComponent('rigidbody', {
            type: rigidbodyType
        });
        entity.addComponent('collision', {
            type: 'box',
            halfExtents: new pc.Vec3(size.x/2, size.y/2, size.z/2)
        });

        const cube = new pc.Entity('cube');

        const material = new pc.StandardMaterial();
        material.diffuse = color;
        material.update();

  
        if(!Game.isHeadless) {
            cube.addComponent("render", {
                material: material,
                type: "box"
            });
        }
        

        cube.setLocalScale(size)

      

        entity.addChild(cube);
        this.app.root.addChild(entity);

        return entity;
    }
}

class EntityPlayer extends pc.Entity {

    public test: string = "cool"

    constructor(name: string) {
        super(name);

        this.addComponent("script");

        this.addComponent('model', {
            type: 'box',
        });
        this.addComponent('rigidbody', {
            type: 'dynamic'
        });
        this.addComponent('collision', {
            type: 'box',
            halfExtents: new pc.Vec3(0.1, 0.1, 0.1)
        });

    
        /*
        this.addComponent('collision', {
            type: 'box',
            halfExtents: new pc.Vec3(0.2, 0.2, 0.2)
        });
        this.addComponent('rigidbody', {
            type: pc.BODYTYPE_DYNAMIC,
            mass: 10
        })
        */
       this.addComponent("script");
        this.script!.create("testScript", {attributes: {
            attribute1: 163
        }});
        this.script!.create("movement")

        this.setLocalScale(new pc.Vec3(0.2, 0.2, 0.2));

        this.setPosition(0, 1, 0)
    }
}

class MovementScript extends pc.ScriptType {

    private force = new pc.Vec3();

    initialize() {
        console.log("[MovementScript] initialize")

        this.fire('initialize');
    }

    postInitialize() {
        this.fire('postInitialize');
    }

    update(dt) {
        this.fire('update', dt);

        var forceX = 0;
        var forceY = 0;
        var forceZ = 0;

        const speed = 0.1;

        // calculate force based on pressed keys
        if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
            forceX = -speed;
        } 

        if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
            forceX += speed;
        }

        if (this.app.keyboard.isPressed(pc.KEY_UP)) {
            forceZ = -speed;
        } 

        if (this.app.keyboard.isPressed(pc.KEY_DOWN)) {
            forceZ += speed;
        }

        if (this.app.keyboard.isPressed(pc.KEY_SPACE)) {
            forceY += 0.2;
        }

        this.force.x = forceX;
        this.force.y = forceY;
        this.force.z = forceZ;

        //console.log(this.force)

        

        // if we have some non-zero force
        if (this.force.length()) {

            // calculate force vector
            /*
            var rX = Math.cos(-Math.PI * 0.25);
            var rY = Math.sin(-Math.PI * 0.25);
            */
            
            var rX = Math.cos(0);
            var rY = Math.sin(0);
            
            this.force.set(this.force.x * rX - this.force.z * rY, 0, this.force.z * rX + this.force.x * rY);

     

            // clamp force to the speed
            if (this.force.length() > speed) {
                this.force.normalize().mulScalar(speed);
            }
        }

        this.force.y = forceY;

        // apply impulse to move the entity
        this.entity.rigidbody!.applyImpulse(this.force);
    }

    postUpdate(dt) {
        this.fire('postUpdate', dt);
    }

    swap() {
        this.fire('swap');
    }
}

class TestScript extends pc.ScriptType {

    public attribute1: number = 0;

    private last: number = 100;

    initialize() {
        console.log("[TestScript] initialize, attribute1:", this.attribute1)

        this.fire('initialize');

        
    }

    postInitialize() {
        this.fire('postInitialize');
    }

    update(dt) {
        this.fire('update', dt);

        //console.log("update", dt)

        //this.entity.rotate(10 * dt, 20 * dt, 30 * dt)

        this.last += dt;
        if(this.last > 0.5) {
            this.last = 0;

            //console.log(this.entity.getPosition());

   
        }

    }

    postUpdate(dt) {
        this.fire('postUpdate', dt);
    }

    swap() {
        this.fire('swap');
    }
}

TestScript.attributes.add('attribute1', {type: 'number'});