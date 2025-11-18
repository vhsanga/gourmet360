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
import { Cambios } from "./Cambios";
import { Camiones } from "./Camiones";
import { Clientes } from "./Clientes";
import { Cobros } from "./Cobros";
import { DespachoDetalles } from "./DespachoDetalles";
import { Despachos } from "./Despachos";
import { DevolucionDetalles } from "./DevolucionDetalles";
import { Devoluciones } from "./Devoluciones";
import { Productos } from "./Productos";
import { Rendiciones } from "./Rendiciones";
import { RutaClientes } from "./RutaClientes";
import { Rutas } from "./Rutas";
import { VentaDetalles } from "./VentaDetalles";
import { Ventas } from "./Ventas";

@Index("fk_usuarios_created_by", ["createdBy"], {})
@Index("fk_usuarios_updated_by", ["updatedBy"], {})
@Entity("usuarios", { schema: "gourmet360" })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("varchar", { name: "nombre", length: 250 })
  nombre: string;

  @Column("varchar", { name: "pin", length: 128 })
  pin: string;

  @Column("enum", { name: "rol", enum: ["admin", "chofer", "supervisor"] })
  rol: "admin" | "chofer" | "supervisor";

  @Column("varchar", { name: "celular", nullable: true, length: 10 })
  celular: string | null;

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
  createdBy: number | null;

  @Column("bigint", { name: "updated_by", nullable: true })
  updatedBy: number | null;

  @OneToMany(
    () => CambioDetalles,
    (cambioDetalles) => cambioDetalles.createdBy2
  )
  cambioDetalles: CambioDetalles[];

  @OneToMany(
    () => CambioDetalles,
    (cambioDetalles) => cambioDetalles.updatedBy2
  )
  cambioDetalles2: CambioDetalles[];

  @OneToMany(() => Cambios, (cambios) => cambios.chofer)
  cambios: Cambios[];

  @OneToMany(() => Cambios, (cambios) => cambios.createdBy2)
  cambios2: Cambios[];

  @OneToMany(() => Cambios, (cambios) => cambios.updatedBy2)
  cambios3: Cambios[];

  @OneToMany(() => Camiones, (camiones) => camiones.chofer)
  camiones: Camiones[];

  @OneToMany(() => Camiones, (camiones) => camiones.createdBy2)
  camiones2: Camiones[];

  @OneToMany(() => Camiones, (camiones) => camiones.updatedBy2)
  camiones3: Camiones[];

  @OneToMany(() => Clientes, (clientes) => clientes.createdBy2)
  clientes: Clientes[];

  @OneToMany(() => Clientes, (clientes) => clientes.updatedBy2)
  clientes2: Clientes[];

  @OneToMany(() => Cobros, (cobros) => cobros.createdBy2)
  cobros: Cobros[];

  @OneToMany(() => Cobros, (cobros) => cobros.updatedBy2)
  cobros2: Cobros[];

  @OneToMany(
    () => DespachoDetalles,
    (despachoDetalles) => despachoDetalles.createdBy2
  )
  despachoDetalles: DespachoDetalles[];

  @OneToMany(
    () => DespachoDetalles,
    (despachoDetalles) => despachoDetalles.updatedBy2
  )
  despachoDetalles2: DespachoDetalles[];

  @OneToMany(() => Despachos, (despachos) => despachos.chofer)
  despachos: Despachos[];

  @OneToMany(() => Despachos, (despachos) => despachos.createdBy2)
  despachos2: Despachos[];

  @OneToMany(() => Despachos, (despachos) => despachos.updatedBy2)
  despachos3: Despachos[];

  @OneToMany(
    () => DevolucionDetalles,
    (devolucionDetalles) => devolucionDetalles.createdBy2
  )
  devolucionDetalles: DevolucionDetalles[];

  @OneToMany(
    () => DevolucionDetalles,
    (devolucionDetalles) => devolucionDetalles.updatedBy2
  )
  devolucionDetalles2: DevolucionDetalles[];

  @OneToMany(() => Devoluciones, (devoluciones) => devoluciones.chofer)
  devoluciones: Devoluciones[];

  @OneToMany(() => Devoluciones, (devoluciones) => devoluciones.createdBy2)
  devoluciones2: Devoluciones[];

  @OneToMany(() => Devoluciones, (devoluciones) => devoluciones.updatedBy2)
  devoluciones3: Devoluciones[];

  @OneToMany(() => Productos, (productos) => productos.createdBy2)
  productos: Productos[];

  @OneToMany(() => Productos, (productos) => productos.updatedBy2)
  productos2: Productos[];

  @OneToMany(() => Rendiciones, (rendiciones) => rendiciones.createdBy2)
  rendiciones: Rendiciones[];

  @OneToMany(() => Rendiciones, (rendiciones) => rendiciones.updatedBy2)
  rendiciones2: Rendiciones[];

  @OneToMany(() => RutaClientes, (rutaClientes) => rutaClientes.createdBy2)
  rutaClientes: RutaClientes[];

  @OneToMany(() => RutaClientes, (rutaClientes) => rutaClientes.updatedBy2)
  rutaClientes2: RutaClientes[];

  @OneToMany(() => Rutas, (rutas) => rutas.chofer)
  rutas: Rutas[];

  @OneToMany(() => Rutas, (rutas) => rutas.createdBy2)
  rutas2: Rutas[];

  @OneToMany(() => Rutas, (rutas) => rutas.updatedBy2)
  rutas3: Rutas[];

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy2: Usuarios;

  @OneToMany(() => Usuarios, (usuarios) => usuarios.createdBy2)
  usuarios: Usuarios[];

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.usuarios2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy2: Usuarios;

  @OneToMany(() => Usuarios, (usuarios) => usuarios.updatedBy2)
  usuarios2: Usuarios[];

  @OneToMany(() => VentaDetalles, (ventaDetalles) => ventaDetalles.createdBy2)
  ventaDetalles: VentaDetalles[];

  @OneToMany(() => VentaDetalles, (ventaDetalles) => ventaDetalles.updatedBy2)
  ventaDetalles2: VentaDetalles[];

  @OneToMany(() => Ventas, (ventas) => ventas.createdBy2)
  ventas: Ventas[];

  @OneToMany(() => Ventas, (ventas) => ventas.updatedBy2)
  ventas2: Ventas[];
}
