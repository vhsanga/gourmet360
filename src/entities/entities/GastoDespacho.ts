import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Despachos } from "./Despachos";
import { Usuarios } from "./Usuarios";

@Index("fk_gasto_despacho_despacho", ["idDespacho"], {})
@Index("fk_gasto_despacho_chofer", ["idChofer"], {})
@Entity("gasto_despacho", { schema: "gourmet360" })
export class GastoDespacho {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id?: number;

  @Column("bigint", { name: "id_despacho" })
  idDespacho?: number;

  @Column("bigint", { name: "id_chofer" })
  idChofer?: number;

  @Column("varchar", { name: "detalle", length: 100 })
  detalle?: string;

  @Column("decimal", {
    name: "valor",
    precision: 10,
    scale: 2,
  })
  valor?: number;

  @ManyToOne(() => Despachos, (despachos) => despachos.gastoDespachos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_despacho", referencedColumnName: "id" }])
  despacho?: Despachos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.gastoDespachos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_chofer", referencedColumnName: "id" }])
  chofer?: Usuarios;
}
