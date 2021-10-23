import { IPacket, PacketType } from "./Packet";

export class PacketSender {
    private _socket;
    private _onReceivePacketCallback: (packet: IPacket) => void;

    constructor(socket: any, onReceivePacketCallback: (packet: IPacket) => void) {
        this._socket = socket;
        this._onReceivePacketCallback = onReceivePacketCallback;

        this._socket.on('packet', (packet) => this.onReceivePacket(packet));
    }

    private onReceivePacket(packet: IPacket) {
        //console.log(`[PacketSender] Received`, packet);

        this._onReceivePacketCallback(packet);
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