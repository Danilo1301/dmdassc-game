export class CreateCanvas {
    public static create() {
        const {mockDOM, createCanvas} = require('node-canvas-webgl/lib');
        mockDOM(window);
        
        
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        

        //const canvas = createCanvas(512, 512);

        console.log(canvas)
        
        return canvas;
    }
}