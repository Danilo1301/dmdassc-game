import * as pc from 'playcanvas';
import socketio from 'socket.io';
import { Entity } from '../entity/entity';
import { GameServer } from "../game/gameServer";
import { IPacket, IPacketData_ConnectToServer, IPacketData_ConnectToServerStatus, IPacketData_EntityData, PacketType } from '../packet/packet';
import { Server } from '../server/server';
import { World } from '../world/world';

export class Client {
    private _game: GameServer;
    private _id: string;
    private _socket: socketio.Socket;

    private _world?: World;
    private _server?: Server;
    private _player?: Entity;

    public get game() { return this._game; }
    public get id() { return this._id; }
    public get socket() { return this._socket; }
    
    public get player() { return this._player; }

    private _sendPacketsDelay: number = 50;
    private _sendTime: number = 0;

    constructor(game: GameServer, socket: socketio.Socket) {
        this._game = game;
        this._id = socket.id;
        this._socket = socket;

        socket.on('packet', packet => this.onReceivePacket(packet));
    }

    public update(dt: number) {
        this._sendTime += dt;

        const world = this._world;

        if(!world) return;

        if(this._sendTime <= this._sendPacketsDelay/1000) return;
        this._sendTime = 0;

        for (const entity of world.entities) {
            if(entity.dontSync) continue;

            const packetData: IPacketData_EntityData = {
                entityId: entity.id,
                data: entity.toJSON()
            }

            this.send(PacketType.ENTITY_DATA, packetData)
            
        }
    }

    public onConnect() {
    }

    public onReceivePacket(packet: IPacket) {
        //console.log(packet)

        if(packet.type == PacketType.CONNECT_TO_SERVER) {
            const data: IPacketData_ConnectToServer = packet.data;
            this.connectToServer(this.game.servers[0]);
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;

            const player = this.player;

            if(!player) return;

            player.canLerp = true;
            player.fromJSON(data.data);
        }
    }

    private connectToServer(server: Server) {
        this._server = server;
        this._world = server.worlds[0];

        this._player = this._world.spawnEntity();
        this._player.setColor(new pc.Color(Math.random(), Math.random(), Math.random()));

        const sendData: IPacketData_ConnectToServerStatus = {
            serverId: 'any',
            entityId: this._player.id,
            success: true
        }

        this.send(PacketType.CONNECT_TO_SERVER_STATUS, sendData);
    }

    public send(type: PacketType, data?: any) {
        const packet: IPacket = {
            type: type,
            data: data
        }
        this.socket.emit('packet', packet);
    }
}