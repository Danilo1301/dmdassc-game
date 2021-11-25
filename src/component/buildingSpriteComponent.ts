import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { GLBLoader } from '../glbLoader/glbLoader';
import { Render } from '../render/render';
import { Component } from "./component";
import { PositionComponent } from './positionComponent';

export class BuildingSpriteComponent extends Component {

    public init() {
        super.init();

        this.loadModel();
        
    }

    private loadModel() {
        var app = Render.app;


        var world = this.entity.world;
        
        const pcEntity = this.entity.pcEntity;

        GLBLoader.loadModel('', (renderRootEntity) => {
            console.log(renderRootEntity)

            /*
            var bdl = renderRootEntity.children[1] as pc.Entity;

            console.log(bdl, 'bld')

            const obj = world.spawnObject();
            obj.position.set(20, 40);
            obj.setPcEntity(bdl);
            */
            
        
            /*
            CREATE COLLISION

            const bodies: Matter.Body[] = [];
            const positions: pc.Vec2[] = [];


            for (const node of renderRootEntity.children) {
                    
                if(node.name.startsWith("Collision")) {
                    console.log(node)

                    const localPosition = node.getLocalPosition();
                    const localScale = node.getLocalScale();
                    
                    const position = new pc.Vec2();
                    position.x = localPosition.x * 100;
                    position.y = localPosition.z * 100;

                    
                    positions.push(position)

                    const size = {
                        x: localScale.x * 100 * 2,
                        y: localScale.z * 100 * 2
                    }

                    const body = Matter.Bodies.rectangle(position.x, position.y, size.x, size.y, {isStatic: true});
                    
                    bodies.push(body);
                    
                    
                }
            }

     

            const bodyCenter = Matter.Body.create({isStatic: true, parts: Object.assign([], bodies)});
            
            Matter.Composite.add(world.matterWorld, bodyCenter);

            Matter.Body.setCentre(bodyCenter, {x: 0, y: 0})

            console.log(bodies)
            console.log(positions)

            for (let index = 0; index <= bodies.length-1; index++) {
                var b = bodies[index];
                var p = positions[index];

                console.log("index", index)

                console.log(p)

            
            }


            setInterval(() => {
                
                
                const positionComponent = this.entity.getComponent(PositionComponent);

                Matter.Body.setAngle(bodyCenter, positionComponent.angle);
                Matter.Body.setPosition(bodyCenter, {
                    x: positionComponent.x * 10,
                    y: positionComponent.y * 10
                });
                
            }, 0)
            */
            
            

            //

            pcEntity.addChild(renderRootEntity);

            
        })
        
        /*
        
        */


        /*
        loadGltf(gltf, app.graphicsDevice, function (err, res) {
            // Wrap the model as an asset and add to the asset registry
            var asset = new pc.Asset('gltf', 'model', {
                url: ''
            });

            asset.resource = res.model;
            asset.loaded = true;
            app.assets.add(asset);

            // Add the loaded scene to the hierarchy
            self.entity.addComponent('model', {
                asset: asset
            });
        }, {
            buffers : self.binAsset.resources
        });
        */
    }

    public update(dt: number) {
        super.update(dt);
    }


    public postupdate(dt: number) {
        super.postupdate(dt);

    }
}