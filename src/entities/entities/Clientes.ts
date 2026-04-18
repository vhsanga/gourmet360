import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";
import { Cobros } from "./Cobros";
import { Devoluciones } from "./Devoluciones";
import { RutaClientes } from "./RutaClientes";
import { Ventas } from "./Ventas";

@Index("fk_clientes_created_by", ["createdBy"], {})
@Index("fk_clientes_updated_by", ["updatedBy"], {})
@Entity("clientes", { schema: "gourmet360" })
export class Clientes {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: number;  // Añadido ?

  @Column("varchar", { name: "nombre", length: 150 })
  nombre?: string;  // Añadido ?

  @Column("varchar", { name: "direccion", nullable: true, length: 250 })
  direccion?: string | null;  // Añadido ?

  @Column("varchar", { name: "contacto", nullable: true, length: 150 })
  contacto?: string | null;  // Añadido ?

  @Column("varchar", { name: "telefono", nullable: true, length: 10 })
  telefono?: string | null;  // Añadido ?

  @Column("boolean", { name: "especial", nullable: true })
  especial?: boolean | null;  // Añadido ?

  @Column("decimal", {
    name: "saldo_actual",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  saldoActual?: string | null;  // Añadido ?

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

  @Column("varchar", { name: "lat", nullable: true, length: 64 })
  lat?: string | null;  // Añadido ?

  @Column("varchar", { name: "lng", nullable: true, length: 64 })
  lng?: string | null;  // Añadido ?

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.clientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2?: Usuarios;  // Añadido ?

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.clientes2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2?: Usuarios;  // Añadido ?

  @OneToMany(() => Cobros, (cobros) => cobros.cliente)
  cobros?: Cobros[];  // Añadido ?

  @OneToMany(() => Devoluciones, (devoluciones) => devoluciones.cliente)
  devoluciones?: Devoluciones[];  // Añadido ?

  @OneToMany(() => RutaClientes, (rutaClientes) => rutaClientes.cliente)
  rutaClientes?: RutaClientes[];  // Añadido ?

  @OneToMany(() => Ventas, (ventas) => ventas.cliente)
  ventas?: Ventas[];  // Añadido ?
}