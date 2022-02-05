import { v4 as uuidv4 } from 'uuid';

export class Item {
    public get id() { return this._id; }

    private _id: string = uuidv4();
}

export class Tab {

}

export class Inventory {

    private _tabs: Tab[] = [];


    constructor() {
        
    }

    public createTab(slotsX: number, slotsY: number) {

    }

}

export class InventoryManager {

    public createInventory(id: string) {
        const inventory = new Inventory();
        return inventory;
    }


}