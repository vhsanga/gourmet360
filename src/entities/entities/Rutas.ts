import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RutaClientes } from "./RutaClientes";
import { Usuarios } from "./Usuarios";

@Index("fk_rutas_chofer", ["choferId"], {})
@Index("fk_rutas_created_by", ["createdBy"], {})
@Index("fk_rutas_updated_by", ["updatedBy"], {})
@Entity("rutas", { schema: "gourmet360" })
export class Rutas {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "nombre", length: 150 })
  nombre: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("bigint", { name: "chofer_id", nullable: true })
  choferId: string | null;

  @Column("tinyint", {
    name: "activo",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  activo: boolean | null;

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

  @OneToMany(() => RutaClientes, (rutaClientes) => rutaClientes.ruta)
  rutaClientes: RutaClientes[];

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.rutas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chofer_id", referencedColumnName: "id" }])
  chofer: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.rutas2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.rutas3, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
