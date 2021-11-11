import Phaser from "phaser";
import { IPacket, PacketType } from "./Packet";

export class PacketSender {

    public receivePacketEvents = new Phaser.Events.EventEmitter();

    private _socket;

    constructor(socket: any) {
        this._socket = socket;
        this._socket.on('packet', (packet) => this.onReceivePacket(packet));
    }

    private onReceivePacket(packet: IPacket) {
        //console.log(`[PacketSender] Received`, packet);

        this.receivePacketEvents.emit('packet', packet);
    }

    public send(packetType: PacketType, data?: any) {
        const packet: IPacket = {
            type: packetType,
            data: data
        }

        //console.log(`[PacketSender] Send`, packet);
        
        this._socket.emit('packet', packet);
    }
}