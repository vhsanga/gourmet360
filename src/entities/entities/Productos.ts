import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CambioDetalles } from "./CambioDetalles";
import { DespachoDetalles } from "./DespachoDetalles";
import { DevolucionDetalles } from "./DevolucionDetalles";
import { Categorias } from "./Categorias";
import { Usuarios } from "./Usuarios";
import { VentaDetalles } from "./VentaDetalles";

@Index("fk_productos_categorias", ["idCategoria"], {})
@Index("fk_productos_created_by", ["createdBy"], {})
@Index("fk_productos_updated_by", ["updatedBy"], {})
@Entity("productos", { schema: "gourmet360" })
export class Productos {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_categoria" })
  idCategoria: string;

  @Column("varchar", { name: "nombre", length: 150 })
  nombre: string;

  @Column("varchar", { name: "unidad", nullable: true, length: 50 })
  unidad: string | null;

  @Column("decimal", { name: "precio_unitario", precision: 10, scale: 2 })
  precioUnitario: string;

  @Column("decimal", {
    name: "precio_unitario_min",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  precioUnitarioMin: string | null;

  @Column("decimal", {
    name: "costo_unitario",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  costoUnitario: string | null;

  @Column("tinyint", {
    name: "activo",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  activo: boolean | null;

  @Column("datetime", {
    name: "fecha_registro",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaRegistro: Date | null;

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

  @OneToMany(() => CambioDetalles, (cambioDetalles) => cambioDetalles.producto)
  cambioDetalles: CambioDetalles[];

  @OneToMany(
    () => DespachoDetalles,
    (despachoDetalles) => despachoDetalles.producto
  )
  despachoDetalles: DespachoDetalles[];

  @OneToMany(
    () => DevolucionDetalles,
    (devolucionDetalles) => devolucionDetalles.producto
  )
  devolucionDetalles: DevolucionDetalles[];

  @ManyToOne(() => Categorias, (categorias) => categorias.productos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_categoria", referencedColumnName: "id" }])
  idCategoria2: Categorias;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.productos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.productos2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;

  @OneToMany(() => VentaDetalles, (ventaDetalles) => ventaDetalles.producto)
  ventaDetalles: VentaDetalles[];
}
