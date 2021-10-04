import { World } from "@game/world/World";
import { BaseEntity } from "./BaseEntity";
import { v4 as uuidv4 } from 'uuid';
import { Position } from "./components/Position";
import { EntityDebug } from "./components/EntityDebug";

export class Entity extends BaseEntity {

    public world: World;
    public position: Position;

    private _id: string;

    public syncTime: number = 0;

    public forceUpdateData: boolean = false;

    constructor(world: World) {
        super();

        this._id = uuidv4();
        this.world = world;

        this.addComponent(new Position());
        this.addComponent(new EntityDebug());

        this.position = this.getComponent(Position);
    }

    public get id() { return this._id; }

    public setId(id: string) {
        this._id = id;
    }
}