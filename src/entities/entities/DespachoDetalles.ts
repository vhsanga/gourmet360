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
import { Productos } from "./Productos";

@Index("fk_despachodetalles_created_by", ["createdBy"], {})
@Index("fk_despachodetalles_despacho", ["despachoId"], {})
@Index("fk_despachodetalles_producto", ["productoId"], {})
@Index("fk_despachodetalles_updated_by", ["updatedBy"], {})
@Entity("despacho_detalles", { schema: "gourmet360" })
export class DespachoDetalles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "despacho_id" })
  despachoId: number;

  @Column("bigint", { name: "producto_id" })
  productoId: number;

  @Column("decimal", { name: "cantidad_entregada", precision: 10, scale: 2 })
  cantidadEntregada: number;

  @Column("decimal", { name: "cantidad_restante", precision: 10, scale: 2 })
  cantidadRestante: number

  @Column("decimal", { name: "cantidad_asignada", precision: 10, scale: 2 })
  cantidadAsignada: number

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

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.despachoDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Despachos, (despachos) => despachos.despachoDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "despacho_id", referencedColumnName: "id" }])
  despacho: Despachos;

  @ManyToOne(() => Productos, (productos) => productos.despachoDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "producto_id", referencedColumnName: "id" }])
  producto: Productos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.despachoDetalles2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
