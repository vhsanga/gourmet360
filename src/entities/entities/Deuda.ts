import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ventas } from "./Ventas";
import { Clientes } from "./Clientes";
import { Usuarios } from "./Usuarios";
import { CobroDeuda } from "./CobroDeuda";

@Index("idx_deuda_cliente", ["clienteId"], {})
@Index("idx_deuda_estado", ["estado"], {})
@Index("idx_deuda_venta", ["ventaId"], {})
@Entity("deuda", { schema: "gourmet360" })
export class Deuda {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: number;

  @Column("bigint", { name: "id_venta" })
  ventaId?: number;

  @Column("bigint", { name: "id_cliente" })
  clienteId?: number;

  @Column("datetime", {
    name: "fecha_creacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion?: Date;

  @Column("decimal", { name: "valor_total", precision: 10, scale: 2 })
  valorTotal?: number;

  @Column("decimal", {
    name: "valor_cobrado",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  valorCobrado?: number;

  @Column("decimal", {
    name: "pago_inicial",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  pagoInicial?: number;

  @Column("decimal", { name: "saldo_pendiente", precision: 10, scale: 2 })
  saldoPendiente?: number;

  @Column("enum", {
    name: "estado",
    enum: ["PENDIENTE", "PARCIAL", "PAGADA", "ANULADA"],
  })
  estado?: "PENDIENTE" | "PARCIAL" | "PAGADA" | "ANULADA";

  @Column("datetime", { name: "fecha_ultimo_cobro", nullable: true })
  fechaUltimoCobro?: Date | null;

  @Column("varchar", { name: "observacion", nullable: true, length: 500 })
  observacion?: string | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt?: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date | null;

  @Column("bigint", { name: "created_by", nullable: true })
  createdBy?: number | null;

  @Column("bigint", { name: "updated_by", nullable: true })
  updatedBy?: number | null;

  @ManyToOne(() => Ventas, (ventas) => ventas.deudas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_venta", referencedColumnName: "id" }])
  venta?: Ventas;

  @ManyToOne(() => Clientes, (clientes) => clientes.deudas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cliente", referencedColumnName: "id" }])
  cliente?: Clientes;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.deudas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2?: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.deudas2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2?: Usuarios;

  @OneToMany(() => CobroDeuda, (cobroDeuda) => cobroDeuda.deuda)
  cobroDeudas?: CobroDeuda[];
}
