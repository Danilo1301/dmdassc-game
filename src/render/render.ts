import * as pc from 'playcanvas';
import { InputHandlerComponent } from "../component/inputHandlerComponent";
import { PositionComponent } from '../component/positionComponent';
import { Entity } from "../entity/entity";
import { GameClient } from '../game/gameClient';
import { PlayCanvas } from "../playcanvas/playcanvas";

export class Render {
    public static game: GameClient;
    public static app: pc.Application;
    public static player: Entity;

    public readonly app: pc.Application;

    public static init(game: GameClient, canvas) {
        this.game = game;

        this.app = PlayCanvas.setupApp(canvas);
        this.app.start();

        PlayCanvas.setupLocalClientScene(this.app);

        window["Render"] = Render;
        window["PlayCanvas"] = PlayCanvas;
    }

    public static update(dt: number) {
        const world = this.game.mainServer.worlds[0];
        const app = this.app;

        for (const entity of world.entities) {
            //entity.render();

            if(!entity.pcEntity.parent) {
                if(!app.root.children.includes(entity.pcEntity)) {
                    app.root.addChild(entity.pcEntity);


                    const material = new pc.StandardMaterial();
                    material.diffuse = new pc.Color(0, 1, 0);
                    material.update();

                    const centerPcEntity = new pc.Entity();
                    centerPcEntity.addComponent("render", {
                        material: material,
                        type: "box",
                    });
                    centerPcEntity.setLocalScale(new pc.Vec3(0.2, 0.2, 0.2));
                    entity.pcEntity.addChild(centerPcEntity);
                }

                
            }

            const pcEntity = entity.pcEntity;
            const positionComponent = entity.getComponent(PositionComponent);
            
            pcEntity.setPosition(positionComponent.x / 10, 0, positionComponent.y / 10);
            pcEntity.setEulerAngles(0, pc.math.RAD_TO_DEG * -positionComponent.angle, 0);
        }
    }

    public static setPlayer(entity: Entity) {
        this.player = entity;
        this.player.getComponent(InputHandlerComponent).enabled = true;
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