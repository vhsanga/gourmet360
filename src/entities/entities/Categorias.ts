import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Productos } from "./Productos";

@Entity("categorias", { schema: "gourmet360" })
export class Categorias {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: string;  // Añadido ? para hacerlo opcional

  @Column("varchar", { name: "nombre", length: 150 })
  nombre?: string;  // Añadido ? para hacerlo opcional

  @Column("tinyint", {
    name: "activo",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  activo?: boolean | null;  // Añadido ?

  @Column("datetime", {
    name: "fecha_registro",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaRegistro?: Date | null;  // Añadido ?

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
  createdBy?: string | null;  // Añadido ?

  @Column("bigint", { name: "updated_by", nullable: true })
  updatedBy?: string | null;  // Añadido ?

  @OneToMany(() => Productos, (productos) => productos.idCategoria2)
  productos?: Productos[];  // Añadido ?
}