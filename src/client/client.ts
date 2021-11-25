import socketio from 'socket.io';
import { Entity } from '../entity/entity';
import { IPacket, IPacket_Entity, PACKET_TYPE } from '../packet/packets';
import { Server } from '../server/server';
import { World } from '../world/world';

export class Client {
    public id: string = "";
    public socket: socketio.Socket;
    public server: Server;
    public player: Entity;

    constructor(socket: socketio.Socket) {
        this.id = socket.id;
        this.socket = socket;

        this.socket.on('p', (packet: IPacket) => {
            this.onReceivePacket(packet);
        })
    }

    public send(packetId: number, data: any) {
        const packet: IPacket = {
            id: packetId,
            data: data
        }
        this.socket.emit('p', packet);

      //  console.log(`[client] send`, packet);
    }

    public onReceivePacket(packet: IPacket) {
        if(packet.id == PACKET_TYPE.ENTITY_DATA) {
            const data = packet.data as IPacket_Entity;
            const world = this.server.worlds[0];

            const entity = this.player;

            for (const component of entity.components) {
                try {
                    const cindex = world.server.entityFactory.getIndexOfComponent(component);
                    if(data.cdata[cindex]) component.unserialize(data.cdata[cindex])
                } catch (error) {}
            }
        }
    }
}