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
  id?: string;  // Añadido ?

  @Column("bigint", { name: "cliente_id" })
  clienteId?: string;  // Añadido ?

  @Column("bigint", { name: "despacho_id" })
  despachoId?: string;  // Añadido ?

  @Column("decimal", { name: "monto_cobrado", precision: 10, scale: 2 })
  montoCobrado?: string;  // Añadido ?

  @Column("datetime", {
    name: "fecha",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha?: Date | null;  // Añadido ?

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

  @ManyToOne(() => Clientes, (clientes) => clientes.cobros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "cliente_id", referencedColumnName: "id" }])
  cliente?: Clientes;  // Añadido ?

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cobros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2?: Usuarios;  // Añadido ?

  @ManyToOne(() => Despachos, (despachos) => despachos.cobros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "despacho_id", referencedColumnName: "id" }])
  despacho?: Despachos;  // Añadido ?

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.cobros2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2?: Usuarios;  // Añadido ?
}