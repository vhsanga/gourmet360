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
  id: number;

  @Column("bigint", { name: "devolucion_id" })
  devolucionId: number;

  @Column("bigint", { name: "producto_id" })
  productoId: number;

  @Column("int", { name: "cantidad_devuelta" })
  cantidadDevuelta: number;

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

  @ManyToOne(
    () => Devoluciones,
    (devoluciones) => devoluciones.devolucionDetalles,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "devolucion_id", referencedColumnName: "id" }])
  devolucion: Devoluciones;

  @ManyToOne(() => Productos, (productos) => productos.devolucionDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "producto_id", referencedColumnName: "id" }])
  producto: Productos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.devolucionDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.devolucionDetalles2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
