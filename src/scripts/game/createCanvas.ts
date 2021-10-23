export class CreateCanvas {
    public static create() {
        const {mockDOM} = require('node-canvas-webgl/lib');
        mockDOM(window);
        
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;

        console.log('webgl', canvas.getContext('webgl'))
        console.log('webgl2', canvas.getContext('webgl2'));

        return canvas;
    }
}