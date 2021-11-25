import Matter from "matter-js";
import { GameClient } from "../src/game/gameClient";

const game = new GameClient(document.getElementById('game'));
game.start();

window['game'] = game;

const width = 800;
const height = 600;
const s = 3;

// renderer
const engine = game.mainServer.worlds[0].engine;
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
const matterWorld = game.mainServer.worlds[0].matterWorld;


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