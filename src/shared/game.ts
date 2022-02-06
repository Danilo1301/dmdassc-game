import { TransformComponent } from "./component/transformComponent";
import { EntityFactory } from "./entityFactory";
import { World } from "./world";
import { InventoryManager } from "./inventoryManager";
import { EntityChar } from "./entity/entityChar";
import { EntityPlayer } from "./entity/entityPlayer";

export class Game {
    public get worlds() { return Array.from(this._worlds.values()); }
    public get entityFactory() { return this._entityFactory; }

    private _worlds = new Map<string, World>();
    private _entityFactory: EntityFactory;
    private _inventoryManager: InventoryManager;

    constructor() {
        this._entityFactory = new EntityFactory();

        this._entityFactory.registerComponent(TransformComponent);


        this._entityFactory.registerEntity('EntityChar', EntityChar);
        this._entityFactory.registerEntity('EntityPlayer', EntityPlayer);

        this._inventoryManager = new InventoryManager();

        const inventory = this._inventoryManager.createInventory('test');
        inventory.createTab(3, 3);
    }

    public start() {
        console.log(`[game] start`);
    }

    public createWorld(name: string) {
        console.log(`[game] create world '${name}'`);

        const world = new World(this);
        this._worlds.set(name, world);
        return world;
    }
}