import * as pc from 'playcanvas'
import { Render } from '../client/render';
import { DataWatcher } from './entity/entity';
import { EventHandler } from './eventHandler';

export interface InputData {
    h?: number
    v?: number
    //mx?: number
    //my?: number
    x?: number
    y?: number
    aa?: number
}

export class Input {
    public static events = new EventHandler();

    public static get mousePosition() { return this._mousePosition; }
    public static get mouseDown() { return this._mouseDown; }

    private static _keys = new Map<number, boolean>();
    private static _mousePosition = new pc.Vec2(0, 0);
    private static _mouseDown: boolean = false;

    private static _dataWatcher = new DataWatcher();

    public static init(app: pc.Application) {
        console.log("[input] init");

        app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
        app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);

        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    }

    public static getAimAngle() {
        if(!Render.app) return 0;

        var graphicsDevice = Render.app.graphicsDevice;
        var screenCenter = new pc.Vec2(graphicsDevice.width / 2, graphicsDevice.height / 2)

        var direction = new pc.Vec2();
        direction.sub2(Input.mousePosition, screenCenter);
        direction.normalize();

        var angle = Math.atan2(direction.y, direction.x);

        return angle;
    }
    
    private static updateMousePosition(event: MouseEvent) {
        this._mousePosition.set(event.x, event.y)
    }

    private static onMouseMove(event: MouseEvent) {
        this.updateMousePosition(event);

        this.emitInputChanged();
    }

    private static onMouseDown(event: MouseEvent) {
        this._mouseDown = true;
        this.updateMousePosition(event);

        this.emitInputChanged();
    }

    public static getHorizontal() {
        const KEY_LEFT = 65;
        const KEY_RIGHT = 68;

        return (Input.getKeyDown(KEY_RIGHT) ? 1 : 0) + ((Input.getKeyDown(KEY_LEFT) ? -1 : 0));
    }

    public static getVertical() {
        const KEY_UP = 87;
        const KEY_DOWN = 83;

        return (Input.getKeyDown(KEY_DOWN) ? 1 : 0) + ((Input.getKeyDown(KEY_UP) ? -1 : 0));
    }

    private static emitInputChanged() {
        let inputData: InputData = {
            h: this.getHorizontal(),
            v: this.getVertical(),
            aa: this.getAimAngle()
            //mx: this.mousePosition.x,
            //my: this.mousePosition.y
        }

        const changed = this._dataWatcher.setData(inputData);

        this.events.emit("changed", changed);
    }
    
    private static onMouseUp(event: MouseEvent) {
        this._mouseDown = false;
        this.updateMousePosition(event);

        this.emitInputChanged();
    }

    public static update(dt: number) {

    }

    public static getKeyDown(key: number | string) {
        const keyCodes: number[] = []

        if(typeof key == 'string') {
            keyCodes.push(key.toLowerCase().charCodeAt(0))
            keyCodes.push(key.toUpperCase().charCodeAt(0))
        } else {
            keyCodes.push(key)
        }

        for (const keyCode of keyCodes) {
            const state = this._keys.get(keyCode) === true;
            if(state) return true;
        }

        return false;
    }

    private static onKeyDown(e: KeyboardEvent) {
        const keyCode = parseInt(e.key);
        this._keys.set(keyCode, true);

        this.emitInputChanged();
    }

    private static onKeyUp(e: KeyboardEvent) {
        const keyCode = parseInt(e.key);
        this._keys.set(keyCode, false);

        this.emitInputChanged();
    }
    
}