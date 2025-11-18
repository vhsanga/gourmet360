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
import { Despachos } from "./Despachos";

@Index("fk_camiones_chofer", ["choferId"], {})
@Index("fk_camiones_created_by", ["createdBy"], {})
@Index("fk_camiones_updated_by", ["updatedBy"], {})
@Entity("camiones", { schema: "gourmet360" })
export class Camiones {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "placa", length: 20 })
  placa: string;

  @Column("varchar", { name: "marca", nullable: true, length: 100 })
  marca: string | null;

  @Column("varchar", { name: "modelo", nullable: true, length: 100 })
  modelo: string | null;

  @Column("decimal", {
    name: "capacidad",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  capacidad: number | null;

  @Column("bigint", { name: "chofer_id", nullable: true })
  choferId: number | null;

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
  updatedBy: string | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.camiones, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chofer_id", referencedColumnName: "id" }])
  chofer: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.camiones2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.camiones3, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;

  @OneToMany(() => Despachos, (despachos) => despachos.camion)
  despachos: Despachos[];
}
