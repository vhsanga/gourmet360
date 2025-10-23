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
import { Rutas } from "./Rutas";

@Index("fk_rutaclientes_cliente", ["clienteId"], {})
@Index("fk_rutaclientes_created_by", ["createdBy"], {})
@Index("fk_rutaclientes_ruta", ["rutaId"], {})
@Index("fk_rutaclientes_updated_by", ["updatedBy"], {})
@Entity("ruta_clientes", { schema: "gourmet360" })
export class RutaClientes {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "ruta_id" })
  rutaId: string;

  @Column("bigint", { name: "cliente_id" })
  clienteId: string;

  @Column("int", { name: "orden_visita", nullable: true })
  ordenVisita: number | null;

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

  @ManyToOne(() => Clientes, (clientes) => clientes.rutaClientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "cliente_id", referencedColumnName: "id" }])
  cliente: Clientes;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.rutaClientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @ManyToOne(() => Rutas, (rutas) => rutas.rutaClientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "ruta_id", referencedColumnName: "id" }])
  ruta: Rutas;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.rutaClientes2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;
}
