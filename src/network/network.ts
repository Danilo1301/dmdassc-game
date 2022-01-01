import ByteBuffer from "bytebuffer";
import { io, Socket } from "socket.io-client";
import { Component } from "../component/component";
import { InputHandlerComponent } from "../component/inputHandlerComponent";
import { SyncComponent } from "../component/syncComponent";
import { TransformComponent } from "../component/transformComponent";
import { Entity } from "../entity/entity";
import { EntityPlayer } from "../entity/player/entityPlayer";
import { Gameface } from "../gameface/gameface";
import { FormatPacket } from "../packet/formatPacket";
import { Packet } from "../packet/packet";

export enum PacketType {
    ENTITY_DATA,
    JOIN_SERVER,
    SPAWN_ENTITY,
    DESTROY_ENTITY,
    CONTROLL_ENTITY
}

export class Network {
    public sendPacketInterval: number = 80;

    private _socket: Socket;
    private _sendPacketTime: number = 0;

    public get address() {
        if(location.host.includes('localhost')) return `${location.protocol}//${location.host}/`;
        return `https://dmdassc-game.glitch.me/`;
    }

    public init() {
        this._socket = io(this.address, {
            //path: '/socket',
            autoConnect: false,
            reconnection: false
        });

        this._socket.on("p", (data: string) => {
            //console.log("p", data)
    
            const buffer = ByteBuffer.fromBase64(data);
            const packet = new Packet();
            packet.buffer = buffer;

            this.onReceivePacket(packet);
        })

        console.log(`[network] Address: (${this.address})`)
    }

    public connect() {
        this._socket.connect();
    }

    public sendJoinServer(id: string) {
        const packet = new Packet();
        packet.writeShort(PacketType.JOIN_SERVER);
        packet.writeString(id);

        this.sendPacket(packet);
    }

    public update(dt: number) {
        this._sendPacketTime += dt;
        if(this._sendPacketTime >= this.sendPacketInterval / 1000) {
            this._sendPacketTime = 0;

            const player = Gameface.Instance.player;
            if(player) this.sendPlayerData(player);
        }
    }

    public sendPlayerData(entity: Entity) {
        const components: Component[] = [entity.transform];
        if(entity.hasComponent(InputHandlerComponent)) components.push(entity.getComponent(InputHandlerComponent));
        const packet = FormatPacket.entityData(entity, components);
        this.sendPacket(packet);
    }

    public sendPacket(packet: Packet) {
        packet.buffer.flip();
        this._socket.emit('p', packet.buffer.toBase64());
    }

    public onReceivePacket(packet: Packet) {
        const packetType: PacketType = packet.readShort();
        
        /*
        if(packetType == PacketType.COMPONENT_DATA) {
            const entityId: string = packet.readString();
            const cindex: number = packet.readShort();

            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) {
                const entity = world.getEntity(entityId)!;
                entity.components.forEach(c => {
                    try {
                        if(cindex == world.game.entityFactory.getIndexOfComponent(c)) {
                            c.unserialize(packet);
                        }
                    } catch (error) {}
                });
            }

        }
        */

        if(packetType == PacketType.ENTITY_DATA) {
            const entityId = packet.readString();

            const world = Gameface.Instance.game.worlds[0];
            const entity = world.getEntity(entityId);
            
            if(entity) {
                FormatPacket.unserializeEntityData(entity, packet);
            }
        }

        if(packetType == PacketType.SPAWN_ENTITY) {
            const entityId: string = packet.readString();
            const entityType: number = packet.readShort();
            
            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) return;

            const entity = world.spawnEntity(world.game.entityFactory.getEntityByIndex(entityType), {id: entityId});
            entity.addComponent(new SyncComponent());

            FormatPacket.unserializeEntityData(entity, packet);
            
            console.log("spsawn entity")
        }

        if(packetType == PacketType.DESTROY_ENTITY) {
            const entityId: string = packet.readString();

            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) {
                world.removeEntity(world.getEntity(entityId)!);
            }
        }

        if(packetType == PacketType.CONTROLL_ENTITY) {
            const entityId: string = packet.readString();

            Gameface.Instance.controllingEntity = entityId;
            Gameface.Instance.checkControllingEntity();
        }
    }
}