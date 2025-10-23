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
import { RutaClientes } from "./RutaClientes";
import { Ventas } from "./Ventas";

@Index("fk_clientes_created_by", ["createdBy"], {})
@Index("fk_clientes_updated_by", ["updatedBy"], {})
@Entity("clientes", { schema: "gourmet360" })
export class Clientes {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "nombre", length: 150 })
  nombre: string;

  @Column("varchar", { name: "direccion", nullable: true, length: 250 })
  direccion: string | null;

  @Column("varchar", { name: "contacto", nullable: true, length: 150 })
  contacto: string | null;

  @Column("varchar", { name: "telefono", nullable: true, length: 10 })
  telefono: string | null;

  @Column("decimal", {
    name: "saldo_actual",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  saldoActual: string | null;

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

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.clientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.clientes2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;

  @OneToMany(() => Cobros, (cobros) => cobros.cliente)
  cobros: Cobros[];

  @OneToMany(() => RutaClientes, (rutaClientes) => rutaClientes.cliente)
  rutaClientes: RutaClientes[];

  @OneToMany(() => Ventas, (ventas) => ventas.cliente)
  ventas: Ventas[];
}
