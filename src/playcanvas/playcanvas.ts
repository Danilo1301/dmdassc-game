import * as pc from 'playcanvas'
import { GameClient } from '../game/gameClient';
import { World } from '../world/world';
import { CameraFollow } from './scripts/cameraFollow';
import { TextScript } from './scripts/textScript';

export class PlayCanvas {
    public static camera: pc.Entity;
    public static sunLight: pc.Entity;

    public static setupApp(canvas) {
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });

        //pc.registerScript(CameraFollow, 'cameraFollow', app);
        pc.registerScript(TextScript, 'textScript', app);

        app.resizeCanvas(800, 600);

        app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);


        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);

        return app;
    }

    public static setupLocalClientScene(app: pc.Application) {

        const camera = this.camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 50, 0);
        //camera.lookAt(0, 0, 0);
        camera.setEulerAngles(-90, 0, 0);
        (camera.addComponent('script') as pc.ScriptComponent).create('cameraFollow');
        
        //

        const light = this.sunLight = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 30, 0);

        light.light!.castShadows = true;

        //

        const text = new pc.Entity('text');
        app.root.addChild(text);
        (text.addComponent('script') as pc.ScriptComponent).create('textScript');
   
    }

    /*
    public static renderWorld(world: World) {
        
        const game = world.server.game as GameClient;
        const app = game.app;

        for (const entity of world.entities) {
            entity.render();

            if(entity.pcEntity) {
                if(!app.root.children.includes(entity.pcEntity)) {
                    app.root.addChild(entity.pcEntity);
                }
            }
            
        }

    }
    */


}