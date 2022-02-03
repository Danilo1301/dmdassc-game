import { InputHandlerComponent } from "./component/inputHandlerComponent";
import { PlayerComponent } from "./component/playerComponent";
import { TransformComponent } from "./component/transformComponent";
import { EntityBuilding } from "./entity/entityBuilding";
import { Entity } from "./entity/entity";
import { EntityPlayer } from "./entity/entityPlayer";
import { EntityVehicle } from "./entity/entityVehicle";
import { EntityFactory } from "./entityFactory";
import { World } from "./world";
import { EntityWeapon } from "./entity/entityWeapon";
import { EntityBullet } from "./entity/entityBullet";

export class Game {
    public get worlds() { return Array.from(this._worlds.values()); }
    public get entityFactory() { return this._entityFactory; }

    private _worlds = new Map<string, World>();
    private _entityFactory: EntityFactory;

    constructor() {
        this._entityFactory = new EntityFactory();

        this._entityFactory.registerComponent(InputHandlerComponent);
        this._entityFactory.registerComponent(PlayerComponent);
        this._entityFactory.registerComponent(TransformComponent);

        this._entityFactory.registerEntity('EntityBuilding', EntityBuilding);
        this._entityFactory.registerEntity('EntityPlayer', EntityPlayer);
        this._entityFactory.registerEntity('EntityVehicle', EntityVehicle);
        this._entityFactory.registerEntity('EntityWeapon', EntityWeapon);
        this._entityFactory.registerEntity('EntityBullet', EntityBullet);
    }

    public start() {
        console.log(`[game] start`);
    }

    public update(dt: number) {
        this.worlds.map(world => world.update(dt));
    }

    public createWorld(name: string) {
        console.log(`[game] create world '${name}'`);

        const world = new World(this);
        this._worlds.set(name, world);
        return world;
    }
}