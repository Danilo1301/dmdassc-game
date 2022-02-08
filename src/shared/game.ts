import { TransformComponent } from "./component/transformComponent";
import { EntityFactory } from "./entityFactory";
import { World } from "./world";
import { InventoryManager } from "./inventoryManager";
import { EntityChar } from "./entity/entityChar";
import { EntityPlayer } from "./entity/entityPlayer";
import { CollisionComponent } from "./component/collisionComponent";
import { PlayerComponent } from "./component/playerComponent";
import { NPCBehaviourComponent } from "./component/npcBehaviourComponent";
import { EntityObject } from "./entity/entityObject";
import { SyncComponent } from "./component/syncComponent";
import { DebugComponent } from "./component/debugComponent";
import { MovementComponent } from "./component/movementComponent";
import { InputHandlerComponent } from "./component/inputHandlerComponent";
import { SpriteComponent } from "./component/spriteComponent";
import { EquipItemComponent } from "./component/equipItemComponent";

export class Game {
    public get worlds() { return Array.from(this._worlds.values()); }
    public get entityFactory() { return this._entityFactory; }

    private _worlds = new Map<string, World>();
    private _entityFactory: EntityFactory;
    private _inventoryManager: InventoryManager;

    public updateInterval: number = 16;
    public fixTime: number = 0.94;

    constructor() {
        this._entityFactory = new EntityFactory();

        this._entityFactory.registerComponent(TransformComponent);
        this._entityFactory.registerComponent(CollisionComponent);
        this._entityFactory.registerComponent(MovementComponent);
        this._entityFactory.registerComponent(InputHandlerComponent);
        this._entityFactory.registerComponent(PlayerComponent);
        this._entityFactory.registerComponent(NPCBehaviourComponent);
        this._entityFactory.registerComponent(SyncComponent);
        this._entityFactory.registerComponent(DebugComponent);
        this._entityFactory.registerComponent(SpriteComponent);
        this._entityFactory.registerComponent(EquipItemComponent);
        
        


        this._entityFactory.registerEntity(EntityChar);
        this._entityFactory.registerEntity(EntityPlayer);
        this._entityFactory.registerEntity(EntityObject);

        this._inventoryManager = new InventoryManager();

        const inventory = this._inventoryManager.createInventory('test');
        inventory.createTab(3, 3);

        let f: number = -1;

        let lastTick = 0;
        setInterval(() => {
            let now = Date.now();

           

            if(now - lastTick >= this.updateInterval) {
                //console.log()

                let dt = (now - (lastTick == 0 ? now : lastTick)) / 1000;
                lastTick = now;

                /*
                if(f == -1) {
                    f = 1;
                    console.log(dt)
                }
                */
    
                if(dt != 0) this.update(dt);
            }

           


            //this.update(dt);
        })
    }

    public start() {
        console.log(`[game] start`);
    }

    public update(dt: number) {
        //console.log(`[game] update ${dt}`);

        
        for (const world of this.worlds) {
            world.tick(dt);   
        }
        
    }

    public createWorld(name: string) {
        console.log(`[game] create world '${name}'`);

        const world = new World(this);
        this._worlds.set(name, world);
        return world;
    }
}