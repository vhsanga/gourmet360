import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clientes } from "./Clientes";
import { Usuarios } from "./Usuarios";
import { Despachos } from "./Despachos";

@Index("fk_cobros_cliente", ["clienteId"], {})
@Index("fk_cobros_created_by", ["createdBy"], {})
@Index("fk_cobros_despacho", ["despachoId"], {})
@Index("fk_cobros_updated_by", ["updatedBy"], {})
@Entity("cobros", { schema: "gourmet360" })
export class Cobros {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "cliente_id" })
  clienteId: string;

  @Column("bigint", { name: "despacho_id" })
  despachoId: string;

  @Column("decimal", { name: "monto_cobrado", precision: 10, scale: 2 })
  montoCobrado: string;

  @Column("datetime", {
    name: "fecha",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha: Date | null;

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

  @ManyToOne(() => Clientes, (clientes) => clientes.cobros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "cliente_id", referencedColumnName: "id" }])
  cliente: Clientes;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cobros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Despachos, (despachos) => despachos.cobros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "despacho_id", referencedColumnName: "id" }])
  despacho: Despachos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cobros2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
