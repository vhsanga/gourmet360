import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VentaDetalles } from "./VentaDetalles";
import { Clientes } from "./Clientes";
import { Usuarios } from "./Usuarios";
import { Despachos } from "./Despachos";

@Index("fk_ventas_cliente", ["clienteId"], {})
@Index("fk_ventas_created_by", ["createdBy"], {})
@Index("fk_ventas_despacho", ["despachoId"], {})
@Index("fk_ventas_updated_by", ["updatedBy"], {})
@Entity("ventas", { schema: "gourmet360" })
export class Ventas {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("bigint", { name: "despacho_id" })
  despachoId: number;

  @Column("bigint", { name: "cliente_id" })
  clienteId: number;

  @Column("datetime", {
    name: "fecha",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha: Date | null;

  @Column("enum", { name: "tipo_pago", enum: ["contado", "credito"] })
  tipoPago: "contado" | "credito";

  @Column("decimal", { name: "total", precision: 10, scale: 2 })
  total: number;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("bigint", { name: "created_by", nullable: true })
  createdBy: number | null;

  @Column("bigint", { name: "updated_by", nullable: true })
  updatedBy: number | null;

  @OneToMany(() => VentaDetalles, (ventaDetalles) => ventaDetalles.venta)
  ventaDetalles: VentaDetalles[];

  @ManyToOne(() => Clientes, (clientes) => clientes.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "cliente_id", referencedColumnName: "id" }])
  cliente: Clientes;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Despachos, (despachos) => despachos.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "despacho_id", referencedColumnName: "id" }])
  despacho: Despachos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.ventas2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
