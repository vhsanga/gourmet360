import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Productos } from "./Productos";

@Entity("categorias", { schema: "gourmet360" })
export class Categorias {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "nombre", length: 150 })
  nombre: string;

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

  @OneToMany(() => Productos, (productos) => productos.idCategoria2)
  productos: Productos[];
}
