import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm';

@Entity('cliente_producto')
export class ClienteProducto {
    @PrimaryColumn({ name: 'cliente_id', type: 'bigint' })
    idCliente?: number;
    @PrimaryColumn("bigint", { name: "producto_id" })
    productoId?: number;
    @Column("decimal", { name: "precio", precision: 10, scale: 2 })
    precio!: number;
}