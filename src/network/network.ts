import { io, Socket } from "socket.io-client";
import { Entity } from "../entity/entity";
import { GameClient } from "../game/gameClient";
import { IPacket, IPacket_Component, IPacket_ControlEntity, IPacket_Entity, PACKET_TYPE } from "../packet/packets";
import { Render } from "../render/render";
import { WorldSync } from "../world/worldSync";

export class Network {
    public sendPacketIntervalMs: number = 80;

    private _game: GameClient;
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

        this._socket.on('p', (packet: IPacket) => {
            this.onReceivePacket(packet);
        })

        console.log(`[network] Address: (${this.address})`)
    }

    public connect() {
        this._socket.connect();
    }

    public update(dt: number) {
        this._sendPacketTime += dt;

        if(this._sendPacketTime >= this.sendPacketIntervalMs / 1000) {
            this._sendPacketTime = 0;

            const player = Render.player;

            if(!player) return;

            const packet = Network.serializeEntity(player);

            this.send(PACKET_TYPE.ENTITY_DATA, packet);
        }

    }

    public send(packetId: number, data: any) {
        const packet: IPacket = {
            id: packetId,
            data: data
        }
        this._socket.emit('p', packet);

        //console.log(`[network] send`, packet);
    }

    public onReceivePacket(packet: IPacket) {
        if(packet.id == PACKET_TYPE.ENTITY_DATA) {
            WorldSync.processEntityPacketData(packet.data);
        }

        if(packet.id == PACKET_TYPE.CONTROL_ENTITY) {
            const data = packet.data as IPacket_ControlEntity;
            WorldSync.entityId = data.id;
        }
    }

    public static serializeEntity(entity: Entity) {
        const componentsData: {[component: string]: IPacket_Component} = {};

        const entityFactory = entity.world.server.entityFactory;

        const packet: IPacket_Entity = {
            id: entity.id,
            type: entityFactory.getIndexOfEntity(entity),
            cdata: componentsData
        }

        for (const component of entity.components) {
            const serializedData = component.serialize();
            if(!serializedData) continue;

            const id = entityFactory.getIndexOfComponent(component);
            
            componentsData[id] = serializedData;
        }

        return packet;
    }
}