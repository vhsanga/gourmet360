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
  idCliente: number;

  @PrimaryColumn({ name: 'id_chofer', type: 'bigint' })
  idChofer: number;

  @Column({ type: 'varchar', length: 150 })
  observacion: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy: number;

}
