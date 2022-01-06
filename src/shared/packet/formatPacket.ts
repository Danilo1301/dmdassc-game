import { Component } from "../component/component";
import { Entity } from "../entity/entity";
import { PacketType } from "../../client/network/network";
import { Packet } from "./packet";

export class FormatPacket {
    /*
    public static componentData(c: Component) {
        const entity = c.entity;
        const cindex = entity.world.game.entityFactory.getIndexOfComponent(c);

        const packet = new Packet();
        packet.writeShort(PacketType.COMPONENT_DATA);
        packet.writeString(entity.id);
        packet.writeShort(cindex);
        c.serialize(packet);
        return packet;
    }
    */

    public static entitySpawn(entity: Entity) {
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
        return packet;
    }

    public static entityDestroy(entity: Entity) {
        const packet = new Packet();
        packet.writeShort(PacketType.DESTROY_ENTITY);
        packet.writeString(entity.id);
        return packet;
    }

    public static entityData(entity: Entity, components: Component[]) {
        const packet = new Packet();
        packet.writeShort(PacketType.ENTITY_DATA);
        packet.writeString(entity.id);
        packet.writeShort(components.length);

        for (const component of components) {
            packet.writeShort(entity.world.game.entityFactory.getIndexOfComponent(component));
            component.serialize(packet);
        }

        return packet;
    }

    public static unserializeEntityData(entity: Entity, packet: Packet) {
        const numComponents: number = packet.readShort();

        for (let i = 0; i < numComponents; i++) {
            const componentType = packet.readShort();

            for (const component of entity.components) {
                try {
                    const cid = entity.world.game.entityFactory.getIndexOfComponent(component);

                    if(cid == componentType) {
                        component.unserialize(packet);
                    }
                } catch (error) { }
               
            }
        }

        //console.log(`[formatPacket] unserializeEntityData ${entity.id} ${numComponents} components`)
    }
}