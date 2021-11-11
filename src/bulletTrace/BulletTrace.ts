import { GameScene } from "@game/scenes/GameScene";

interface IBulletTracer {
    graphics?: Phaser.GameObjects.Graphics
    start: Phaser.Math.Vector2
    end: Phaser.Math.Vector2
    createdAt: number
    color: number
    lifeTime: number
}

export class BulletTrace {

    private static _tracers: IBulletTracer[] = [];

    public static spawnTracer(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2, color?: number) {

        if(!GameScene.Instance) return;

        const tracer: IBulletTracer = {
            start: start,
            end: end,
            createdAt: Date.now(),
            color: color != undefined ? color : 0xffff00,
            lifeTime: 200
        }

        this._tracers.push(tracer);

        for (const tracer of this._tracers) {
            const t = this.getTracerTimeLeft(tracer, tracer.lifeTime);

            if(t == 0) {
                this._tracers.splice(this._tracers.indexOf(tracer), 1);

                tracer.graphics?.destroy();
            }
        }

        console.log(`${this._tracers.length} tracers`)
    }

    private static getTracerTimeLeft(tracer: IBulletTracer, timeLimit: number) {
        const now = Date.now();
        return Math.max(0, timeLimit - (now - tracer.createdAt))
    }

    public static update(delta: number) {
        const scene = GameScene.Instance;
        

        for (const tracer of this._tracers) {
            if(!tracer.graphics) {
                tracer.graphics = scene.add.graphics();
            }

            const timeLimit = tracer.lifeTime;
            const timeLeft = this.getTracerTimeLeft(tracer, timeLimit);

            const alpha = timeLeft / timeLimit;

            tracer.graphics.clear();
            tracer.graphics.lineStyle(2, tracer.color, alpha);
            tracer.graphics.lineBetween(tracer.start.x, tracer.start.y, tracer.end.x, tracer.end.y);
        }


    }

    public static raycast(bodies, start, r, dist){
        const Matter: any = Phaser.Physics.Matter['Matter'];

        var normRay = Matter.Vector.normalise(r);
        var ray = normRay;
        for(var i = 0; i < dist; i++){
            ray = Matter.Vector.mult(normRay, i);
            ray = Matter.Vector.add(start, ray);
            var bod = Matter.Query.point(bodies, ray)[0];
            if(bod) {
                return {point: ray, body: bod};
            }
        }
        return;
    }

}