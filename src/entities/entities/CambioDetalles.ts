import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cambios } from "./Cambios";
import { Productos } from "./Productos";
import { Usuarios } from "./Usuarios";

@Index("cambio_id", ["cambioId"], {})
@Index("created_by", ["createdBy"], {})
@Index("producto_id", ["productoId"], {})
@Index("updated_by", ["updatedBy"], {})
@Entity("cambio_detalles", { schema: "gourmet360" })
export class CambioDetalles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("bigint", { name: "cambio_id" })
  cambioId: number;

  @Column("bigint", { name: "producto_id" })
  productoId: number;

  @Column("int", { name: "cantidad_entregada" })
  cantidadEntregada: number;

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

  @ManyToOne(() => Cambios, (cambios) => cambios.cambioDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "cambio_id", referencedColumnName: "id" }])
  cambio: Cambios;

  @ManyToOne(() => Productos, (productos) => productos.cambioDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "producto_id", referencedColumnName: "id" }])
  producto: Productos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cambioDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cambioDetalles2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
