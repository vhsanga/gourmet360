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
import { Devoluciones } from "./Devoluciones";
import { Usuarios } from "./Usuarios";

@Index("chofer_id", ["choferId"], {})
@Index("created_by", ["createdBy"], {})
@Index("devolucion_id", ["devolucionId"], {})
@Index("updated_by", ["updatedBy"], {})
@Entity("cambios", { schema: "gourmet360" })
export class Cambios {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("bigint", { name: "devolucion_id" })
  devolucionId: number;

  @Column("bigint", { name: "chofer_id" })
  choferId: number;

  @Column("date", { name: "fecha_cambio" })
  fechaCambio: Date;

  @Column("int", {
    name: "total_productos",
    nullable: true,
    default: () => "'0'",
  })
  totalProductos: number | null;

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

  @OneToMany(() => CambioDetalles, (cambioDetalles) => cambioDetalles.cambio)
  cambioDetalles: CambioDetalles[];

  @ManyToOne(() => Devoluciones, (devoluciones) => devoluciones.cambios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "devolucion_id", referencedColumnName: "id" }])
  devolucion: Devoluciones;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cambios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chofer_id", referencedColumnName: "id" }])
  chofer: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cambios2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cambios3, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
