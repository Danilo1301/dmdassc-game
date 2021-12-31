import { v4 as uuidv4 } from 'uuid';
import { Client } from '../client/client';
import { Component } from '../component/component';
import { SyncComponent, SyncType } from '../component/syncComponent';
import { Entity } from '../entity/entity';
import { EntityPlayer } from '../entity/player/entityPlayer';
import { Game } from '../game/game';
import { PacketType } from '../network/network';
import { Packet } from '../packet/packet';

export class Server {
    public get id() { return this._id; }
    public get game() { return this._game; }
    public get clients() { return Array.from(this._clients.values()); }

    private _id: string = uuidv4();
    private _game: Game;
    private _clients = new Map<string, Client>();

    constructor() {
        this._game = new Game();
    }

    public start() {
        const game = this.game;
        game.start();
        
        const world = game.createWorld('world');
        world.init();
        world.generateWorld();
    }

    public update(dt: number) {
        this.game.update(dt);
        this.clients.map(client => client.update(dt));
    }

    public onClientJoin(client: Client) {
        console.log("client joined")

        this._clients.set(client.id, client);

        const world = this.game.worlds[0];

        const player = world.spawnEntity(EntityPlayer);
        const syncComponent = player.addComponent(new SyncComponent());
        syncComponent.syncType = SyncType.SERVER_SYNC;


        client.setPlayer(player);
        client.checkStreamedEntities();

        //
        const packet = new Packet();
        packet.writeShort(PacketType.CONTROLL_ENTITY);
        packet.writeString(player.id);
        client.sendPacket(packet);

        console.log("sent controll")
        //

      
    }
}


