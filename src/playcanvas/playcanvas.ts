import * as pc from 'playcanvas'
import { GameClient } from '../game/gameClient';
import { World } from '../world/world';

export class PlayCanvas {
    public static camera: pc.Entity;

    public static setupApp(canvas) {
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });

        app.resizeCanvas(800, 600);
 

        /*
        const ObjModelParser = require('./objModelParser.js');

        const m: any = app.loader.getHandler("model");
        m.addParser(new ObjModelParser(app.graphicsDevice), function (url, data) {
            return (pc.path.getExtension(url) === '.obj');
        });
        */



        //app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        //app.setCanvasResolution(pc.RESOLUTION_AUTO);

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
        
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 0, 0);

   
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