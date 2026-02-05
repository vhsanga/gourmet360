import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clientes } from 'src/entities/entities/Clientes';
import { ClientesChofer } from 'src/entities/entities/ClientesChofer';
import { DataSource, Repository } from 'typeorm';
import { CreateClienteDto } from '../dto/create-cliente.dto';

@Injectable()
export class ClientesChoferService {
  constructor(
    @InjectRepository(ClientesChofer)
    private readonly clientesChoferRepo: Repository<ClientesChofer>,
    private dataSource: DataSource
  ) {}

  async listarClientesPorChofer(idChofer: number, idDespacho: number) {
    const sql = `
      SELECT 
        cc.id_cliente AS idCliente,
        c.nombre AS nombreCliente,
        c.direccion AS direccionCliente,
        c.telefono AS telefonoCliente,
        c.lat,
        c.lng,
        cc.observacion,
        cc.created_at AS createdAt,
        cc.updated_at AS updatedAt,
        (
          SELECT COUNT(id) 
          FROM ventas v 
          WHERE v.cliente_id = cc.id_cliente 
            AND v.despacho_id = ?
        ) AS entregado
      FROM clientes_chofer cc
      INNER JOIN clientes c ON c.id = cc.id_cliente
      WHERE cc.id_chofer = ?
      ORDER BY cc.created_at DESC;
    `;

    return await this.clientesChoferRepo.query(sql, [
      idDespacho,idChofer
    ]);
  }

  async listarAllClientesPorChofer(idChofer: number) {
    const sql = `
      SELECT 
        cc.id_cliente AS idCliente,
        c.nombre AS nombreCliente,
        c.direccion AS direccionCliente,
        c.telefono AS telefonoCliente,
        c.lat,
        c.lng,
        cc.observacion,
        cc.created_at AS createdAt,
        cc.updated_at AS updatedAt
      ORDER BY cc.created_at DESC;
    `;

    return await this.clientesChoferRepo.query(sql, {
      idChofer:idChofer,
    }as any);
  }

  async consultarProductosAsignadosByChoferId(choferId: number) {
    const sql = `
        select dd.id id_despacho_detalle, dd.despacho_id, dd.producto_id, p.nombre producto,  c.nombre categoria, p.precio_unitario, dd.cantidad_entregada, dd.cantidad_restante, dd.cantidad_asignada from despachos d
        inner join despacho_detalles dd on dd.despacho_id =d.id
        inner join productos p ON p.id = dd.producto_id 
        inner join categorias c on p.id_categoria = c.id
        where d.chofer_id = ? and d.estado ='pendiente'
      `;
    return await this.clientesChoferRepo.query(sql, [choferId]);
  }

  async consultarDespachoPendientes(choferId: number) {
    const sql = `
        select id, fecha, estado, (select sum(dd.cantidad_restante) from despacho_detalles dd where dd.despacho_id =d.id) restante from despachos d  where chofer_id  = ? and estado ='pendiente' limit 1
      `;
    const result =  await this.clientesChoferRepo.query(sql, [choferId]);
    return result.length ? result[0] : {};
  }

  async createClienteChofer(createClienteDto: CreateClienteDto) {
    console.log('DTO recibido en el servicio:', createClienteDto);
    const { id_chofer,  ...clienteData } = createClienteDto;
    console.log('Datos del cliente extraídos:', clienteData);
    // Creamos el queryRunner para manejar la transacción manualmente
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. Crear la instancia de Cliente y guardar
      const nuevoCliente = queryRunner.manager.create(Clientes, {
        ...clienteData,
        created_by: id_chofer,
        updated_by: id_chofer,
      });
      const clienteGuardado = await queryRunner.manager.save(nuevoCliente);
      // 2. Si hay un chofer asociado, guardar en la tabla intermedia
      if (id_chofer) {
        const relacionChofer = queryRunner.manager.create(ClientesChofer, {
          idCliente: clienteGuardado.id,
          idChofer: id_chofer,
          observacion: clienteData.especial ? 'Cliente especial' : '',
          createdBy: id_chofer,
          updatedBy: id_chofer,
        });
        await queryRunner.manager.save(relacionChofer);
      }
      // Si todo fue exitoso, confirmamos los cambios
      await queryRunner.commitTransaction();
      return clienteGuardado;

    } catch (err) {
      // Si hay cualquier error, deshacemos todo lo hecho en la transacción
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('No se pudo crear el cliente: ' + err.message);
    } finally {
      // Es vital liberar el queryRunner para no dejar conexiones abiertas
      await queryRunner.release();
    }
  }

  
}
