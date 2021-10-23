import * as pc from "../../playcanvas";
import socketio from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameServer } from '../game/gameServer';
import { PacketSender } from '../network/packetSender';
import { IPacket, IPacketData_ConnectToServerStatus, IPacketData_EntityData, PacketType } from '../network/packet';
import { World } from '../world/world';
import { EntityPlayer } from '../entity/entityPlayer';
import { Server } from '../server/server';
import { Game } from '../game/game';
import { EntityWatcher } from '../dataWatcher/entityWatcher';
import { EntitySync } from '../scripts/entitySync';


export class Client {
    private _id: string;
    private _game: GameServer;
    private _socket: socketio.Socket;
    private _packetSender: PacketSender;

    private _server: Server;
    private _world: World;
    private _player: EntityPlayer;

    private _sendPacketsDelay: number = 30;
    private _lastSentPackets: number = 0;

    public get game() { return this._game; }
    public get connected() { return this._socket.connected; }

    private _entities = new Map<string, EntityWatcher>();

    constructor(game: GameServer, socket: socketio.Socket) {
        this._id = uuidv4();
        this._game = game;
        this._socket = socket;
        this._packetSender = new PacketSender(socket, this.onReceivePacket.bind(this));
        //this._packetSender.receivePacketEvents.on('packet', (packet: IPacket) => this.onReceivePacket(packet));
        
       
        this._socket.on('disconnect', () => this.onDisconnect());
        this.onConnect();

        setInterval(() => { this.update(); }, 1)
    }

    public update() {
        if(!this.connected) return;

        const world = this._world;

        if(!world) return;

        const now = Date.now();

        if(now - this._lastSentPackets >= this._sendPacketsDelay) {
            this._lastSentPackets = now;

            const entities = world.entities;

            for (const entity of entities) {

                if(!this._entities.has(entity.id)) {
                    this._entities.set(entity.id, new EntityWatcher(entity));

                    console.log("added")
                }

                const entityWatcher = this._entities.get(entity.id)!;
                
                entityWatcher.process();
                const newData = entityWatcher.getNewData();
    
                if(newData) {
                    
                    const packetData: IPacketData_EntityData = {
                        entityId: entity.id,
                        data: newData
                    }

                    this.send(PacketType.ENTITY_DATA, packetData)
                }

                //this.send(PacketType.ENTITY_DATA, entity.toJSON())
            }
        }
    }

    private onConnect() {

    }

    private onDisconnect() {
        this._world.destroyEntity(this._player.id);
    }

    private onReceivePacket(packet: IPacket) {
        
        
        if(packet.type == PacketType.CONNECT_TO_SERVER) {

            const server = this.game.servers[0];
            const world = server.worlds[0];

            this._server = server;
            this._world = world;
            this._player = world.createPlayer(new pc.Vec3(Math.random()*8-4, 3, Math.random()*8-4));
            const script = <EntitySync>this._player.script!.create('entitySync');
            script.positionLerp = 0.5;

            const data: IPacketData_ConnectToServerStatus = {
                serverId: 'someid',
                entityId: this._player.id,
                success: false
            } 
            this.send(PacketType.CONNECT_TO_SERVER_STATUS, data);
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;

            this._player.fromJSON(data.data);
        }
    }

    public send(packetType: PacketType, data?: any) {
        setTimeout(() => {
            this._packetSender.send(packetType, data);
        }, Game.testDelay);
    }
}