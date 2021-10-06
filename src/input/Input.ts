export class Input {
    public static events = new Phaser.Events.EventEmitter();

    private static _keys = new Map<number, boolean>();
    private static _mousePosition = new Phaser.Math.Vector2();
    private static _mouseDown: boolean = false;

    public static get mousePosition() { return this._mousePosition; }

    public static setup(scene: Phaser.Scene) {
        const input = scene.input;

        input.keyboard.on('keydown', (e) => {
            this._keys.set(e.keyCode, true);

            this.events.emit('input_changed');
        })

        input.keyboard.on('keyup', (e) => {
            this._keys.set(e.keyCode, false);

            this.events.emit('input_changed');
        })

        input.addListener('pointermove', this.onPointerMove, this)

        input.addListener('pointerdown', (e) => {
            this._mouseDown = true;

            this.events.emit('input_changed');
        })
        input.addListener('pointerup', (e) => {
            this._mouseDown = false;

            this.events.emit('input_changed');
        })
    }

    private static onPointerMove(pointer) {
        const cursor = pointer;
        this._mousePosition.x = cursor.x
        this._mousePosition.y = cursor.y
        
        this.events.emit('input_changed');
    }

    public static getKeyDown(key: number | string)
    {
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

    public static getHorizontal() {
        let horizontal = (this.getKeyDown('a') ? -1 : 0) + (this.getKeyDown('d') ? 1 : 0)
        
        
        /*
        var force = Phaser.Math.Clamp(this._joyStick.force / 100, -1, 1)


        if(this._joyStick.enabled) {
            horizontal += Math.cos(Phaser.Math.DegToRad(this._joyStick.angle)) * force
        }
        */

        return horizontal
    }

    public static getVertical() {
        let vertical = (this.getKeyDown('w') ? -1 : 0) + (this.getKeyDown('s') ? 1 : 0)

        /*
        var force = Phaser.Math.Clamp(this._joyStick.force / 100, -1, 1)

        if(this._joyStick.enabled)
        {
            vertical += Math.sin(Phaser.Math.DegToRad(this._joyStick.angle)) * force
        }
        */

        return vertical
    }

    public static getMouseDown() {
        return this._mouseDown;
    }
}