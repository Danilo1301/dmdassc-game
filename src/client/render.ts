import * as pc from 'playcanvas'
import { Entity } from '../shared/entity/entity';
import { World } from "../shared/world";

export class Render {
    public static app: pc.Application;
    public static world?: World;
    public static camera: pc.Entity;
    public static sunLight: pc.Entity;

    private static _renderingEntities: Entity[] = [];

    public static init(app: pc.Application) {
        this.app = app;

        this.setupLocalClientScene();
    }

    public static render(dt: number) {
        this.renderWorld(dt);
    }

    private static renderWorld(dt: number) {
        const world = this.world;
        const app = this.app;

        if(!world) return;


        for (const entity of world.entities) {

            
            if(!this._renderingEntities.includes(entity)) {
                this._renderingEntities.push(entity);

                entity.createPcEntity();

                console.log("[render] add pcEntity");

                app.root.addChild(entity.pcEntity);

                //console.log(entity.pcEntityRoot.children)
                //console.log("found", entity.pcEntityRoot.findByName('CenterDebug'))

                if(!entity.pcEntityRoot.findByName('CenterDebug')) {
                    const material = new pc.StandardMaterial();
                    material.diffuse = new pc.Color(0, 1, 0);
                    material.update();

                    const centerPcEntity = new pc.Entity('CenterDebug');
                    centerPcEntity.addComponent("render", {
                        material: material,
                        type: "box",
                    });
                    centerPcEntity.render!.castShadows = false;
                    centerPcEntity.setLocalScale(new pc.Vec3(0.1, 0.1, 0.1));
                    entity.pcEntityRoot.addChild(centerPcEntity);

                    //console.log('CenterDebug', entity)
                }

               

                /*
                can't create new pc.Entity every time it streams in..
                */
                
            }

            /*
            const transform = entity.transform;
            const position = transform.getPosition();
            entity.pcEntity.setPosition(position.x * 0.01, 0, position.y * 0.01);
            entity.pcEntityRoot.setEulerAngles(0, pc.math.RAD_TO_DEG * -transform.angle, 0);
            */
            
        }
        
        for (const entity of this._renderingEntities) {
            if(!world.entities.includes(entity)) 
            {
                this._renderingEntities.splice(this._renderingEntities.indexOf(entity), 1);

                console.log("[render] remove pcEntity");
                app.root.removeChild(entity.pcEntity);
            }
        }

        for (const entity of this._renderingEntities) {
            entity.render(dt);
        }
        
        for (const entity of this._renderingEntities) {
            entity.postrender(dt);
        }
    }

    public static setupLocalClientScene() {
        const app = this.app;
        const camera = this.camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 20, 0);
        //camera.lookAt(0, 0, 0);
        camera.setEulerAngles(-90, 0, 0);
        (camera.addComponent('script') as pc.ScriptComponent).create('cameraFollow');
        
        console.log('camera', camera);

        app.scene.ambientLight.set(0, 0, 0)

        //

        /*
        
        const light = this.sunLight = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        //light.setEulerAngles(30, 30, 0);
        light.setEulerAngles(30, 30, 0);


        
        light.light!.color = new pc.Color(1, 1, 1);
        light.light!.castShadows = true;
        light.light!.shadowType = 3;
        light.light!.shadowDistance = 40
        light.light!.intensity = 0.05

        
        console.log('light', light);

        window['light'] = light;
        */
        

        //

        const text = new pc.Entity('text');
        app.root.addChild(text);
        (text.addComponent('script') as pc.ScriptComponent).create('textScript');
   
        this.test();

    }

    private static test() {
        const app = this.app;

        const light = new pc.Entity('light');
        const lightComponent = light.addComponent('light') as pc.LightComponent;
        light.setPosition(2, 2, 0)
        app.root.addChild(light);

        lightComponent.type = "point"
        lightComponent.color = new pc.Color(1, 1, 1);
        lightComponent.range = 10;
        lightComponent.intensity = 1;
        lightComponent.shadowBias = 0.2
        
        lightComponent.castShadows = true;

        window['testlight'] = lightComponent
        //lightComponent.shadowType = 3;
        //lightComponent.shadowDistance = 40

        /*
        temp1.range = 3
        temp1.entity.setPosition(0, 0.5, 0)
        temp1.intensity = 32
        */

        console.warn(lightComponent)
        //lightComponent.shape = pc.LIGHTSHAPE_SPHERE;
    }

    public static loadAsset(url: string, callback: (asset: pc.Asset) => void) {
        const imageUrl = url;
        const app = Render.app;
        
        app.loader.getHandler("texture")['crossOrigin'] = "anonymous";
        
        const asset = new pc.Asset("myTexture", "texture", {url: imageUrl});

        asset.on("error", function (message) {
            console.log(message);
        });

        asset.on("load", function (asset) {
            callback(asset); 
        });

        app.assets.add(asset);
        app.assets.load(asset);
        return asset;
    }

    public static createGunFlash(x: number, y: number) {
        const app = this.app;

        if(!app) return;

        const light = new pc.Entity('light');
        const lightComponent = light.addComponent('light') as pc.LightComponent;
        light.setPosition(x * 0.01, 0.2, y * 0.01)
        app.root.addChild(light);

        lightComponent.type = "point"
        lightComponent.color = new pc.Color(1, 1, 0);
        lightComponent.range = 1;
        lightComponent.intensity = 1

        setTimeout(() => {
            light.destroy();
            app.root.removeChild(light);
        }, 60);
    }
}