import { GameScene } from "@game/scenes/GameScene";

interface IBulletTracer {
    graphics?: Phaser.GameObjects.Graphics
    start: Phaser.Math.Vector2
    end: Phaser.Math.Vector2
    createdAt: number
}

export class BulletTrace {

    private static _tracers: IBulletTracer[] = [];

    public static spawnTracer(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2) {
        const tracer: IBulletTracer = {
            start: start,
            end: end,
            createdAt: Date.now()
        }

        this._tracers.push(tracer);
    }

    public static update(delta: number) {
        const scene = GameScene.Instance;
        const now = Date.now();

        for (const tracer of this._tracers) {
            if(!tracer.graphics) {
                tracer.graphics = scene.add.graphics();
            }

            const timeLimit = 500;
            const timeLeft = Math.max(0, timeLimit - (now - tracer.createdAt))

            const alpha = timeLeft / timeLimit;

            tracer.graphics.clear();
            tracer.graphics.lineStyle(4, 0xffff00, alpha);
            tracer.graphics.lineBetween(tracer.start.x, tracer.start.y, tracer.end.x, tracer.end.y);
        }


    }
}