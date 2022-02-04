import Matter from "matter-js";
import { Gameface } from "../src/client/gameface";
import { Render } from "../src/client/render";
import { Input } from "../src/shared/input";

const gameface = new Gameface(document.getElementById('game'));
gameface.start();

window['gameface'] = gameface;
window['Render'] = Render;
window['Input'] = Input;

//createMatterRender();

function createMatterRender() {
    const width = 800;
    const height = 600;
    const s = 2;
    
    // renderer
    const engine = gameface.game.worlds[0].matter.engine!;
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        bounds: {
            min: { 
                x: -width/2 * s, 
                y: -height/2 * s
            },
            max: { 
                x: width/2 * s,
                y: height/2 * s
            }
         },
         options: {
             hasBounds: true,
             width: width,
             height: height,
             showAngleIndicator: true
         }
    });
    Matter.Render.run(render);
    
    
    
    // mouse constraint
    const matterWorld = gameface.game.worlds[0].matter.world!;
    
    const constraint: any = {
        stiffness: 0.2,
        render: {
            visible: false
        }
    };
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: constraint
    });
    Matter.Composite.add(matterWorld, mouseConstraint);
}

