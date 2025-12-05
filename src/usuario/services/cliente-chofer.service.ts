import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesChofer } from 'src/entities/entities/ClientesChofer';
import { Repository } from 'typeorm';

@Injectable()
export class ClientesChoferService {
  constructor(
    @InjectRepository(ClientesChofer)
    private readonly clientesChoferRepo: Repository<ClientesChofer>,
  ) {}

  async listarClientesPorChofer(idChofer: number) {
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
        FROM clientes_chofer cc
        INNER JOIN clientes c ON c.id = cc.id_cliente
        WHERE cc.id_chofer = ?
        ORDER BY cc.created_at DESC;
    `;
    return await this.clientesChoferRepo.query(sql, [idChofer]);
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
}
