import ByteBuffer from 'bytebuffer';
import socketio from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Component } from '../component/component';
import { Entity } from '../entity/entity';
import { MasterServer } from '../masterServer/materServer';
import { PacketType } from '../network/network';
import { FormatPacket } from '../packet/formatPacket';
import { Packet } from '../packet/packet';

export class Client {
    public get id() { return this._id; }

    private _id: string = uuidv4();

    private _socket?: socketio.Socket;
    private _player?: Entity;

    private _streamedEntities: Entity[] = [];

    public setPlayer(player: Entity) {
        this._player = player;
    }

    public setSocket(socket: socketio.Socket) {
        this._socket = socket;

        socket.on("p", (data: string) => {
            const buffer = ByteBuffer.fromBase64(data);
            const packet = new Packet();
            packet.buffer = buffer;

            this.onReceivePacket(packet);
        })
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
            
            const server = MasterServer.Instance.servers[0];

            const world = server;

            server.onClientJoin(this);

            console.log("join", id)
        }
    }

    public checkStreamedEntities() {
        const player = this._player;

        if(!player) return;

        const world = player.world;

        for (const entity of world.entities) {
            
            if(!this._streamedEntities.includes(entity)) {
                console.log(`[client] entity stream in ${entity.id}`);

                this._streamedEntities.push(entity);

                this.sendEntitySpawn(entity);
            }

        }
    }

    public update(dt: number) {
        const player = this._player;

        this.checkStreamedEntities();

        if(player) {
            for (const entity of this._streamedEntities) {

                this.sendEntityData(entity);

                /*
                entity.components.map(component => {
                    try {
                        const packet = FormatPacket.componentData(component);
                        this.sendPacket(packet);
                    } catch (error) {}
                })
                */
            }
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
        console.log("[client] sendEntitySpawn", entity.id);

        const components: Component[] = [];

        for (const c of entity.components) {
            try {
                entity.world.game.entityFactory.getIndexOfComponent(c);
                components.push(c);
            } catch (error) { }

        }

        const packet = new Packet();
        packet.writeShort(PacketType.SPAWN_ENTITY);
        packet.writeString(entity.id);
        packet.writeShort(entity.world.game.entityFactory.getIndexOfEntity(entity));
        packet.writeShort(components.length);

        for (const component of components) {
            packet.writeShort(entity.world.game.entityFactory.getIndexOfComponent(component));
            component.serialize(packet);
        }

        this.sendPacket(packet);
    }
}