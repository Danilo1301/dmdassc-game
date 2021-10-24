import { Game } from "../game/game";
import { World } from "../world/world";

export class Server {
    private _game: Game;
    private _worlds = new Map<string, World>();

    public get worlds() { return Array.from(this._worlds.values()); }
    public get game() { return this._game; }

    constructor(game: Game) {
        this._game = game;

        this.createWorld('world');
    }

    public update(dt: number) {
        this.worlds.map(world => world.update(dt));
    }

    public createWorld(name: string) {
        const world = new World(this);
        this._worlds.set(name, world);
    }
}