import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes_chofer')
export class ClientesChofer {
  @PrimaryColumn({ name: 'id_cliente', type: 'bigint' })
  idCliente?: number;  // Añadido ?

  @PrimaryColumn({ name: 'id_chofer', type: 'bigint' })
  idChofer?: number;  // Añadido ?

  @Column({ type: 'varchar', length: 150 })
  observacion?: string;  // Añadido ?

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;  // Añadido ?

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt?: Date;  // Añadido ?

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy?: number | null;  // Añadido ? (manteniendo el null)

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy?: number | null;  // Añadido ? (manteniendo el null)
}