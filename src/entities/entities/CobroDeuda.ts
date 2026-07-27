import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Deuda } from "./Deuda";
import { Usuarios } from "./Usuarios";

@Index("idx_cobro_chofer", ["idChofer"], {})
@Index("idx_cobro_deuda", ["idDeuda"], {})
@Index("idx_cobro_fecha", ["fechaCobro"], {})
@Entity("cobro_deuda", { schema: "gourmet360" })
export class CobroDeuda {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: number;

  @Column("bigint", { name: "id_deuda" })
  idDeuda?: number;

  @Column("datetime", {
    name: "fecha_cobro",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCobro?: Date;

  @Column("decimal", { name: "valor_cobrado", precision: 10, scale: 2 })
  valorCobrado?: number;

  @Column("bigint", { name: "id_chofer" })
  idChofer?: number;

  @Column("enum", {
    name: "tipo_pago",
    enum: ["EFECTIVO", "TRANSFERENCIA"],
  })
  tipoPago?: string;

  @Column("varchar", { name: "referencia", nullable: true, length: 150 })
  referencia?: string | null;

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

  @ManyToOne(() => Deuda, (deuda) => deuda.cobroDeudas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_deuda", referencedColumnName: "id" }])
  deuda?: Deuda;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cobroDeudas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_chofer", referencedColumnName: "id" }])
  chofer?: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cobroDeudas2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2?: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cobroDeudas3, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2?: Usuarios;
}
