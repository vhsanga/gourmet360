import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Devoluciones } from "./Devoluciones";
import { Productos } from "./Productos";
import { Usuarios } from "./Usuarios";

@Index("created_by", ["createdBy"], {})
@Index("devolucion_id", ["devolucionId"], {})
@Index("producto_id", ["productoId"], {})
@Index("updated_by", ["updatedBy"], {})
@Entity("devolucion_detalles", { schema: "gourmet360" })
export class DevolucionDetalles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: number;  // Añadido ?

  @Column("bigint", { name: "devolucion_id" })
  devolucionId?: number;  // Añadido ?

  @Column("bigint", { name: "producto_id" })
  productoId?: number;  // Añadido ?

  @Column("int", { name: "cantidad_devuelta" })
  cantidadDevuelta?: number;  // Añadido ?

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt?: Date | null;  // Añadido ?

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date | null;  // Añadido ?

  @Column("bigint", { name: "created_by", nullable: true })
  createdBy?: number | null;  // Añadido ?

  @Column("bigint", { name: "updated_by", nullable: true })
  updatedBy?: number | null;  // Añadido ?

  @ManyToOne(
    () => Devoluciones,
    (devoluciones) => devoluciones.devolucionDetalles,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "devolucion_id", referencedColumnName: "id" }])
  devolucion?: Devoluciones;  // Añadido ?

  @ManyToOne(() => Productos, (productos) => productos.devolucionDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "producto_id", referencedColumnName: "id" }])
  producto?: Productos;  // Añadido ?

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.devolucionDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2?: Usuarios;  // Añadido ?

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.devolucionDetalles2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2?: Usuarios;  // Añadido ?
}