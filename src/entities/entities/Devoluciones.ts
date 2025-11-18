import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cambios } from "./Cambios";
import { DevolucionDetalles } from "./DevolucionDetalles";
import { Clientes } from "./Clientes";
import { Usuarios } from "./Usuarios";

@Index("chofer_id", ["choferId"], {})
@Index("cliente_id", ["clienteId"], {})
@Index("created_by", ["createdBy"], {})
@Index("updated_by", ["updatedBy"], {})
@Entity("devoluciones", { schema: "gourmet360" })
export class Devoluciones {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("bigint", { name: "cliente_id" })
  clienteId: number;

  @Column("bigint", { name: "chofer_id" })
  choferId: number;

  @Column("date", { name: "fecha_devolucion" })
  fechaDevolucion: Date;

  @Column("varchar", { name: "observacion", nullable: true, length: 255 })
  observacion: string | null;

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

  @OneToMany(() => Cambios, (cambios) => cambios.devolucion)
  cambios: Cambios[];

  @OneToMany(
    () => DevolucionDetalles,
    (devolucionDetalles) => devolucionDetalles.devolucion
  )
  devolucionDetalles: DevolucionDetalles[];

  @ManyToOne(() => Clientes, (clientes) => clientes.devoluciones, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "cliente_id", referencedColumnName: "id" }])
  cliente: Clientes;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.devoluciones, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chofer_id", referencedColumnName: "id" }])
  chofer: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.devoluciones2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.devoluciones3, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
