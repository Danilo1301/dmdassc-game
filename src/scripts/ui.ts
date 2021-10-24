import * as pc from "playcanvas";
import { Game } from "../game/game";

const cssTest = `
.container {
    position: absolute;
    top: 16px;
    left: 16px;
    
    background-color: #222;
    color: #fff;
    font-weight: 100;
    padding: 8px;
    
    box-shadow: 0 0 16px rgba(0, 0, 0, .3);
}

.container > .button {
    float: left;
    display: inline-block;
    background-color: #07f;
    padding: 0 16px;
    font-size: 18px;
    line-height: 32px;
    border-radius: 4px;
    cursor: pointer;
    
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.container > .counterBox {
    float: right;
}

.container .counter {
    color: #ff0;
    font-size: 24px;
}

.container > .text {
    margin-top: 52px;
}
`;

export class UI extends pc.ScriptType {

    private counter: number = 0;
    private div: HTMLDivElement;

    public initialize() {
        this.fire('initialize');

        var style = document.createElement('style');

        // append to head
        document.head.appendChild(style);
        style.innerHTML = cssTest || '';
        
        // Add the HTML
        this.div = document.createElement('div');
        this.div.classList.add('container');
        this.div.innerHTML = `html` || '';
        
        // append to body
        // can be appended somewhere else
        // it is recommended to have some container element
        // to prevent iOS problems of overfloating elements off the screen
        document.body.appendChild(this.div);
        
        this.bindEvents();
    }

    private bindEvents() {
        var self = this;
        // example
        //
        // get button element by class
        var button = this.div.querySelector('.button');
        var counter = this.div.querySelector('.counter');
        // if found
        if (button) {
            // add event listener on `click`
            button.addEventListener('click', function() {
                ++self.counter;
                if (counter)
                    counter.textContent = `${self.counter}`;
                
                console.log('button clicked');
    
                // try to find object and change its material diffuse color
                // just for fun purposes
                var obj = self.app.root.findByName('box') as pc.Entity;

                if (obj && obj.render) {
                    var material = obj.render.meshInstances[0].material;
                    if (material) {
                        material['diffuse'].set(Math.random(), Math.random(), Math.random());
                        material.update();
                    }
                }
            }, false);
        }
    
        if (counter)
            counter.textContent = `${self.counter}`;
    }
}

UI.attributes.add('css', {type: 'asset', assetType:'css', title: 'CSS Asset'});
UI.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});
