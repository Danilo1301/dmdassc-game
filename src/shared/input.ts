import * as pc from 'playcanvas'

export class Input {
    public static get mousePosition() { return this._mousePosition; }

    private static _keys = new Map<number, boolean>();
    private static _mousePosition = new pc.Vec2(0, 0);
    private static _mouseDown: boolean = false;

    public static init(app: pc.Application) {
        console.log("[input] init");

        app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
        app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);

        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

    }

    private static updateMousePosition(event: MouseEvent) {
        this._mousePosition.set(event.x, event.y)
    }

    private static onMouseMove(event: MouseEvent) {
        this.updateMousePosition(event);
    }

    private static onMouseDown(event: MouseEvent) {
        this._mouseDown = true;
        this.updateMousePosition(event);
    }

    private static onMouseUp(event: MouseEvent) {
        this._mouseDown = false;
        this.updateMousePosition(event);
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
    }

    private static onKeyUp(e: KeyboardEvent) {
        const keyCode = parseInt(e.key);
        this._keys.set(keyCode, false);
    }
    
}