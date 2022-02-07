import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Render } from '../../client/render';
import { UI, UIText } from '../../client/ui/ui';
import { Entity } from "../entity/entity";
import { WorldSyncType } from '../world';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { SyncType } from './syncComponent';

export class DebugComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    private _uitext?: UIText;

    private _textLines = new Map<string, string>();

    public initData(): void {
    
    }
    
    public init() {
        super.init();

        this.setLineText('default', this.entity.constructor.name);
    }

    public setLineText(line: string, text: string) {
        this._textLines.set(line, text);
    }

    public render(dt: number): void {

        if(!Render.app) return;

        if(!this._uitext) {

            this._uitext = UI.addText(0, 0, '');
            this._uitext.entity.element.fontSize = 8;
        }


        //const position = this.entity.transform.getPosition();

        var worldPos = this.entity.pcEntity.getPosition();
        var screenPos = new pc.Vec3();
        
        // get screen space co-ord
        Render.camera.camera.worldToScreen(worldPos, screenPos);

        var pixelRatio = Render.app.graphicsDevice.maxPixelRatio;
        screenPos.x *= pixelRatio;
        screenPos.y *= pixelRatio;

        // convert to screen component co-ordinates
        var screenEntity = UI.screen.entity;
        var scale = screenEntity.screen.scale;

        var device = Render.app.graphicsDevice;

        this._uitext.entity.setLocalPosition(screenPos.x / scale, (device.height - screenPos.y) / scale, 0);  

        let str = ``;

        for (const pair of this._textLines) {
            str += `${pair[1]}\n`;
        }
        
        this._uitext.entity.element.text = str;
    }

    public update(dt: number) {
        super.update(dt);
    }
}