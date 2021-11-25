
import { Client } from "../client/client";
import { CollisionComponent } from "../component/collisionComponent";
import { InputHandlerComponent } from "../component/inputHandlerComponent";
import { ObjectSpriteComponent } from "../component/objectSpriteComponent";
import { PositionComponent } from "../component/positionComponent";
import { TestAnimSpriteComponent } from "../component/testAnimSprite";
import { VehicleComponent } from "../component/vehicleComponent";
import { VehicleSpriteComponent } from "../component/vehicleSpriteComponent";
import { EntityObject } from "../entity/entityObject";
import { EntityPlayer } from "../entity/entityPlayer";
import { EntityVehicle } from "../entity/entityVehicle";
import { Game } from "../game/game";
import { World } from "../world/world";
import { EntityFactory } from "./entityFactory";

export class Server {
    public id: string = "";
    public get game() { return this._game; }
    public get worlds() { return Array.from(this._worlds.values()); }
    public get entityFactory() { return this._entityFactory; }

    private _game: Game;
    private _worlds = new Map<string, World>();
    private _entityFactory: EntityFactory;

    constructor(game: Game) {
        this._game = game;
        this._entityFactory = new EntityFactory();
        this.registerEntitiesAndComponents();
    }

    private registerEntitiesAndComponents() {
        const entityFactory = this._entityFactory;

        entityFactory.registerEntity("EntityPlayer", EntityPlayer);
        entityFactory.registerEntity("EntityObject", EntityObject);
        entityFactory.registerEntity("EntityVehicle", EntityVehicle);

        entityFactory.registerComponent("PositionComponent", PositionComponent);
        entityFactory.registerComponent("CollisionComponent", CollisionComponent);
        entityFactory.registerComponent("InputHandlerComponent", InputHandlerComponent);
        entityFactory.registerComponent("ObjectSpriteComponent", ObjectSpriteComponent);
        entityFactory.registerComponent("TestAnimSpriteComponent", TestAnimSpriteComponent);
        entityFactory.registerComponent("VehicleComponent", VehicleComponent);
        entityFactory.registerComponent("VehicleSpriteComponent", VehicleSpriteComponent);
    }

    public init() {
        console.log(`[server] init`);

        this.createWorld('world');
    }

    public update(dt: number) {
        this.worlds.map(world => world.update(dt));
        this.worlds.map(world => world.postupdate(dt));
    }

    public createWorld(name: string) {
        console.log(`[server] create world '${name}'`);

        const world = new World(this);
        this._worlds.set(name, world);
        world.init();
    }
}