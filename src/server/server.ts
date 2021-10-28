import { Entity } from "../entity/entity";
import { EntityObject } from "../entity/entityObject";
import { EntityPlayer } from "../entity/entityPlayer";
import { Game } from "../game/game";
import { World } from "../world/world";
import { EntityFactory } from "./entityFactory";

export class Server {
    private _game: Game;
    private _worlds = new Map<string, World>();
    private _entityFactory: EntityFactory;

    public get worlds() { return Array.from(this._worlds.values()); }
    public get game() { return this._game; }
    public get entityFactory() { return this._entityFactory; }

    constructor(game: Game) {
        this._game = game;
        this._entityFactory = new EntityFactory();

        this.entityFactory.registerEntity('EntityPlayer', EntityPlayer);
        this.entityFactory.registerEntity('EntityObject', EntityObject);

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