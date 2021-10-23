import { Game } from "../game/game";
import { Client } from "../client/client";
import { World } from "../world/world";

export class Server {
    private _clients = new Map<string, Client>();
    private _worlds = new Map<string, World>();
    private _game: Game;

    public get game() { return this._game };
    public get worlds() { return Array.from(this._worlds.values()) };

    constructor(game: Game) {
        this._game = game;

        this.createWorld('world');
    }

    public createWorld(id: string) {
        console.log(`[${this.constructor.name}]`, `createWorld ${id}`);

        const world = new World(this);
        this._worlds.set(id, world);
        return world;
    }
}