//import ByteBuffer from "bytebuffer";

export enum PacketType {
    ENTITY_DATA,
    JOIN_SERVER,
    SPAWN_ENTITY,
    DESTROY_ENTITY,
    CONTROL_ENTITY,
    WEAPON_SHOT,
    COMPONENT_EVENT
}

export interface IPacketData_ComponentEvent {
    entity: string
    component: number
    event: string
    data: any
}

export interface IPacketData_JoinServer {
    id: string
}

export interface IPacketData_ControlEntity {
    id: string
}

export interface IPacketData_SpawnEntity {
    id: string
    type: number
    data: any
}

export interface IPacketData_DestroyEntity {
    id: string
}

export interface IPacketData_EntityData {
    id: string
    d: any
}

export interface Packet {
    type: PacketType
    data: any
}

/*
export class Packet {
    public buffer = new ByteBuffer();
    public index: string[] = [];

    public writeShort(value: number) {
        this.buffer.writeShort(value);
        this.index.push("short");
    }

    public writeString(value: string) {
        this.buffer.writeShort(value.length);
        this.buffer.writeString(value);
        this.index.push("short - len");
        this.index.push("string");
    }

    public writeFloat(value: number) {
        this.buffer.writeFloat(value);
        this.index.push("float");
    }

    public writeDouble(value: number) {
        this.buffer.writeDouble(value);
        this.index.push("double");
    }

    public readType() {
        return this.buffer.readShort() as PacketType;
    }

    public readShort() {
        return this.buffer.readShort();
    }

    public readFloat() {
        return this.buffer.readFloat();
    }

    public readDouble() {
        return this.buffer.readDouble();
    }

    public readString() {
        const len = this.readShort();
        return this.buffer.readUTF8String(len);
    }
}
*/