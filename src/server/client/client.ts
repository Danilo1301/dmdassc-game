import ByteBuffer from 'bytebuffer';
import socketio from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Component } from '../../shared/component/component';
import { Entity } from '../../shared/entity/entity';
import { PacketType } from '../../client/network/network';
import { FormatPacket } from '../../shared/packet/formatPacket';
import { Packet } from '../../shared/packet/packet';
import { MasterServer } from '../masterServer/masterServer';
import { Server } from '../server/server';

export class Client {
    public sendPacketInterval: number = 40;
    public get id() { return this._id; }
    public get addressList() { return this._addressList; }
    public get player() { return this._player; }

    private _id: string = uuidv4();

    private _socket?: socketio.Socket;

    private _player?: Entity;
    private _server?: Server;

    private _addressList: string[] = [];

    private _streamedEntities: Entity[] = [];
    private _sendPacketTime: number = 0;

    public getCurrentAddress() {
        return this._socket!.handshake.address
    }

    public setPlayer(player: Entity) {
        this._player = player;
        this.sendControllingEntity(player);
    }

    public resetClient() {
        this._streamedEntities = []
    }

    public setSocket(socket: socketio.Socket) {
        this._socket = socket;

        socket.on("p", this.onReceiveData.bind(this))
        socket.on("disconnect", this.onDisconnect.bind(this))
        
        this.resetClient();
        this.addIPAddress(socket.handshake.address)
        this.onConnect();
    }

    private addIPAddress(address: string) {
        if(!this._addressList.includes(address)) {
        this._addressList.push(address);
            if(this._addressList.length >= 2) this._addressList.splice(0, 1)
        }
    }

    private onReceiveData(data: string) {
        const buffer = ByteBuffer.fromBase64(data);
        const packet = new Packet();
        packet.buffer = buffer;

        this.onReceivePacket(packet);
    }

    private onConnect() {
        //MasterServer.postGameLog(this.getCurrentAddress(), "connected")
    }

    private onDisconnect() {
        const server = this._server;

        if(server) {
            server.onClientLeave(this);
        }

        //MasterServer.postGameLog(this.getCurrentAddress(), "disconnected")
    }

    public sendControllingEntity(entity: Entity) {
        const packet = new Packet();
        packet.writeShort(PacketType.CONTROLL_ENTITY);
        packet.writeString(entity.id);

        this.sendPacket(packet);

        console.log("control")
    }

    public onReceivePacket(packet: Packet) {
        const packetType: PacketType = packet.readShort();
    
        if(packetType == PacketType.ENTITY_DATA) {
            const entityId = packet.readString();
            
            if(this._player) {
                if(this._player.id == entityId) {

                    FormatPacket.unserializeEntityData(this._player, packet);

                } else {
                    console.log("not same id");
                }
            }

        }

        if(packetType == PacketType.JOIN_SERVER) {
            const id = packet.readString();
            
            console.log("join", id)

            const server = MasterServer.Instance.servers[0];
            this._server = server;

            server.onClientJoin(this);
        }
    }

    public checkStreamedEntities() {
        const player = this._player;

        if(!player) return;

        const playerPosition = player.transform.position;

        const world = player.world;

        for (const entity of world.entities) {

            const distance: number = playerPosition.distance(entity.transform.position);

            let canBeStreamed = false;
            if(distance < 1200) canBeStreamed = true;

            if(canBeStreamed) {
                if(!this._streamedEntities.includes(entity)) {
                    console.log(`[client] entity stream in ${entity.id}`);
    
                    this._streamedEntities.push(entity);
    
                    this.sendEntitySpawn(entity);
                }
            } else {
                if(this._streamedEntities.includes(entity)) {
                    console.log(`[client] entity stream out ${entity.id}`);
    
                    this._streamedEntities.splice(this._streamedEntities.indexOf(entity), 1);
    
                    this.sendEntityDestroy(entity);
                }
            }
            

        }
    }

    public update(dt: number) {
        this.checkStreamedEntities();

        this._sendPacketTime += dt;
        if(this._sendPacketTime >= this.sendPacketInterval / 1000) {
            this._sendPacketTime = 0;
            this.sendStreamedEntitiesData();
        }
    }

    private sendStreamedEntitiesData() {
        for (const entity of this._streamedEntities) {
            this.sendEntityData(entity);
        }
    }

    public sendPacket(packet: Packet) {
        packet.buffer.flip();
        this._socket?.emit('p', packet.buffer.toBase64());
    }

    public sendEntityData(entity: Entity) {

        const components: Component[] = [];
        for (const c of entity.components) {
            try {
                entity.world.game.entityFactory.getIndexOfComponent(c);
                components.push(c);
            } catch (error) { }
        }

        const packet = FormatPacket.entityData(entity, components);
        this.sendPacket(packet);
    }

    public sendEntitySpawn(entity: Entity) {
        const packet = FormatPacket.entitySpawn(entity);
        this.sendPacket(packet);
    }

    public sendEntityDestroy(entity: Entity) {
        const packet = FormatPacket.entityDestroy(entity);
        this.sendPacket(packet);
    }
}