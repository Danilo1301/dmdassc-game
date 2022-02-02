import * as pc from 'playcanvas'
import { Entity } from '../../shared/entity/entity';
import { World } from "../../shared/world/world";
import { WorldTextManager } from '../worldText/worldTextManager';

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

    public static update(dt: number) {
        this.renderWorld();

        WorldTextManager.render()
    }

    private static renderWorld() {
        const world = this.world;
        const app = this.app;

        if(!world) return;


        for (const entity of world.entities) {

            if(!this._renderingEntities.includes(entity)) {
                this._renderingEntities.push(entity);

                console.log("[render] add pcEntity");

                app.root.addChild(entity.pcEntity);

                console.log(entity.pcEntityRoot.children)
                console.log("found", entity.pcEntityRoot.findByName('CenterDebug'))

                if(!entity.pcEntityRoot.findByName('CenterDebug')) {
                    const material = new pc.StandardMaterial();
                    material.diffuse = new pc.Color(0, 1, 0);
                    material.update();

                    const centerPcEntity = new pc.Entity('CenterDebug');
                    centerPcEntity.addComponent("render", {
                        material: material,
                        type: "box",
                    });
                    centerPcEntity.setLocalScale(new pc.Vec3(0.2, 0.2, 0.2));
                    entity.pcEntityRoot.addChild(centerPcEntity);

                    console.log('CenterDebug', entity)
                }

               

                /*
                can't create new pc.Entity every time it streams in..
                */
                
            }

            const transform = entity.transform;
            const position = transform.getPosition();
            entity.pcEntity.setPosition(position.x * 0.01, 0, position.y * 0.01);
            entity.pcEntityRoot.setEulerAngles(0, pc.math.RAD_TO_DEG * -transform.angle, 0);
            
        }

        for (const entity of this._renderingEntities) {
            if(!world.entities.includes(entity)) 
            {
                this._renderingEntities.splice(this._renderingEntities.indexOf(entity), 1);

                console.log("[render] remove pcEntity");
                app.root.removeChild(entity.pcEntity);
            }
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

        //

        const light = this.sunLight = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 30, 0);

        
        light.light!.castShadows = true;
        light.light!.shadowType = 3;
        light.light!.shadowDistance = 40
        
        console.log('light', light);

        window['light'] = light;

        //

        const text = new pc.Entity('text');
        app.root.addChild(text);
        (text.addComponent('script') as pc.ScriptComponent).create('textScript');
   
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
}