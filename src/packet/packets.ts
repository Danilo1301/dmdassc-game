export enum PACKET_TYPE {
    ENTITY_DATA,
    CONTROL_ENTITY
}

export interface IPacket {
    id: number
    data: any
}

export interface IPacket_Component {
    type: number
    data: any
}

export interface IPacket_ControlEntity {
    id: string
}

export interface IPacket_Entity {
    id: string
    type: number
    cdata: {[component: string]: IPacket_Component}
}