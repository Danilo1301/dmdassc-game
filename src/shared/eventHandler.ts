export class EventHandler {
    private _events = new Map<string, ((...args: any) => void)[]>();

    public on(event: string, fn: (...args: any) => void) {
        console.log(`added listener for ${event}`);

        if(!this._events.has(event)) {
            this._events.set(event, []);
        }

        this._events.get(event)!.push(fn);

        //console.log(this._events)
    }   

    public emit(event: string, ...args) {
        //console.log(event, args)

        if(!this._events.has(event)) return;

        for (const fn of this._events.get(event)!) {
            fn.apply(null, args);
        }

    }
}