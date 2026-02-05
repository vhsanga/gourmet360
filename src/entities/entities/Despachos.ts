import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cobros } from "./Cobros";
import { DespachoDetalles } from "./DespachoDetalles";
import { Camiones } from "./Camiones";
import { Usuarios } from "./Usuarios";
import { Rendiciones } from "./Rendiciones";
import { Ventas } from "./Ventas";

@Index("fk_despachos_camion", ["camionId"], {})
@Index("fk_despachos_chofer", ["choferId"], {})
@Index("fk_despachos_created_by", ["createdBy"], {})
@Index("fk_despachos_updated_by", ["updatedBy"], {})
@Entity("despachos", { schema: "gourmet360" })
export class Despachos {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("bigint", { name: "chofer_id" })
  choferId: number;

  @Column("bigint", { name: "camion_id" })
  camionId: number;

  @Column("date", { name: "fecha" })
  fecha: string;

  @Column("enum", {
    name: "estado",
    nullable: true,
    enum: ["pendiente", "en_ruta", "finalizado"],
    default: () => "'pendiente'",
  })
  estado: "pendiente" | "en_ruta" | "finalizado" | null;

  @Column("decimal", {
    name: "gastos",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  gastos: number | null;

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

  @OneToMany(() => Cobros, (cobros) => cobros.despacho)
  cobros: Cobros[];

  @OneToMany(
    () => DespachoDetalles,
    (despachoDetalles) => despachoDetalles.despacho
  )
  despachoDetalles: DespachoDetalles[];

  @ManyToOne(() => Camiones, (camiones) => camiones.despachos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "camion_id", referencedColumnName: "id" }])
  camion: Camiones;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.despachos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chofer_id", referencedColumnName: "id" }])
  chofer: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.despachos2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.despachos3, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;

  @OneToMany(() => Rendiciones, (rendiciones) => rendiciones.despacho)
  rendiciones: Rendiciones[];

  @OneToMany(() => Ventas, (ventas) => ventas.despacho)
  ventas: Ventas[];
}
