import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";
import { Productos } from "./Productos";
import { Ventas } from "./Ventas";

@Index("fk_ventadetalles_created_by", ["createdBy"], {})
@Index("fk_ventadetalles_producto", ["productoId"], {})
@Index("fk_ventadetalles_updated_by", ["updatedBy"], {})
@Index("fk_ventadetalles_venta", ["ventaId"], {})
@Entity("venta_detalles", { schema: "gourmet360" })
export class VentaDetalles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "venta_id" })
  ventaId: string;

  @Column("bigint", { name: "producto_id" })
  productoId: string;

  @Column("decimal", { name: "cantidad", precision: 10, scale: 2 })
  cantidad: string;

  @Column("decimal", { name: "precio_unitario", precision: 10, scale: 2 })
  precioUnitario: string;

  @Column("decimal", {
    name: "subtotal",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  subtotal: string | null;

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

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.ventaDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Productos, (productos) => productos.ventaDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "producto_id", referencedColumnName: "id" }])
  producto: Productos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.ventaDetalles2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;

  @ManyToOne(() => Ventas, (ventas) => ventas.ventaDetalles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "venta_id", referencedColumnName: "id" }])
  venta: Ventas;
}
