import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";
import { Despachos } from "./Despachos";

@Index("fk_rendiciones_created_by", ["createdBy"], {})
@Index("fk_rendiciones_despacho", ["despachoId"], {})
@Index("fk_rendiciones_updated_by", ["updatedBy"], {})
@Entity("rendiciones", { schema: "gourmet360" })
export class Rendiciones {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "despacho_id" })
  despachoId: string;

  @Column("decimal", {
    name: "productos_vendidos",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  productosVendidos: string | null;

  @Column("decimal", {
    name: "productos_fiados",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  productosFiados: string | null;

  @Column("decimal", {
    name: "productos_perdidos",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  productosPerdidos: string | null;

  @Column("decimal", {
    name: "productos_sobrantes",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  productosSobrantes: string | null;

  @Column("decimal", {
    name: "total_cobrado",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  totalCobrado: string | null;

  @Column("text", { name: "observaciones", nullable: true })
  observaciones: string | null;

  @Column("datetime", {
    name: "fecha_cierre",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCierre: Date | null;

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
  createdBy: string | null;

  @Column("bigint", { name: "updated_by", nullable: true })
  updatedBy: string | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.rendiciones, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Despachos, (despachos) => despachos.rendiciones, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "despacho_id", referencedColumnName: "id" }])
  despacho: Despachos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.rendiciones2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
