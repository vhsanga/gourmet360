import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DespachoDetalles } from 'src/entities/entities/DespachoDetalles';
import { Usuarios } from 'src/entities/entities/Usuarios';
import { VentaDetalles } from 'src/entities/entities/VentaDetalles';
import { Ventas } from 'src/entities/entities/Ventas';
import { Repository, DataSource } from 'typeorm';
import { CreateVentaDto } from '../dtos/create-venta.dto';
import { CustomUtils } from 'src/utils/custom_utils';
import { ClienteProducto } from 'src/entities/entities/ClienteProductos';

@Injectable()
export class VentasService {
  constructor(
    private dataSource: DataSource,
  ) {}

  async registrarVenta(dto: CreateVentaDto) {
    const { idCliente, idDespacho, detalles, idChofer } = dto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = new Ventas();
      venta.despachoId = idDespacho;
      venta.clienteId = idCliente;
      venta.fecha = new Date();
      venta.total = dto.total;
      venta.pagado = dto.pagado ?? 0;
      venta.efectivo = dto.efectivo ?? 0;
      venta.transferencia = dto.transferencia ?? 0;
      venta.createdBy = idChofer;
      const ventaGuardada = await queryRunner.manager.save(Ventas, venta);

      // 4️⃣ Procesar detalles
      for (const item of detalles) {
        const despachoDetalle = await queryRunner.manager.findOne(
          DespachoDetalles,
          {
            where: {
              despachoId: idDespacho,
              productoId: item.idProducto,
            },
          },
        );

        if (!despachoDetalle) {
          throw new NotFoundException(
            `El producto ${item.idProducto} no está en el despacho.`,
          );
        }

        if ((despachoDetalle.cantidadRestante ?? 0) < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente del producto ${item.idProducto}. Disponible: ${despachoDetalle.cantidadRestante ?? 0}`,
          );
        }

        // 4.1 — Descontar stock
        despachoDetalle.cantidadRestante = (despachoDetalle.cantidadRestante ?? 0) - item.cantidad;
        despachoDetalle.cantidadEntregada =  Number(despachoDetalle.cantidadEntregada ?? 0) + Number(item.cantidad);
        await queryRunner.manager.save(DespachoDetalles, despachoDetalle);

        // 4.2 — Guardar detalle de venta
        const detalleVenta = new VentaDetalles();
        detalleVenta.ventaId = ventaGuardada.id;
        detalleVenta.productoId = item.idProducto;
        detalleVenta.cantidad = item.cantidad;
        detalleVenta.precioUnitario = item.precioUnitario;
        detalleVenta.createdBy = idChofer;

        await queryRunner.manager.save(VentaDetalles, detalleVenta);

        if(item.precioCliente) {
          const clienteProducto = new ClienteProducto();
          clienteProducto.idCliente = idCliente;
          clienteProducto.productoId = item.idProducto;
          clienteProducto.precio = item.precioCliente;
          await queryRunner.manager.upsert(ClienteProducto, clienteProducto, ['idCliente', 'productoId']);
        }
      }

      // 5️⃣ Confirmar transacción
      await queryRunner.commitTransaction();
      return CustomUtils.responseApi('Venta registrada con éxito', {ventaId: ventaGuardada.id});
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async obtenerResumenVentasPorFecha(fecha: string) {
    const fechaInicio = `${fecha} 00:00:00`;
    const sql = `
      SELECT
          sum(v.pagado) total_ventas_contado,
	        sum(v.total - v.pagado) total_ventas_credito, 
          MAX(vd.cantidad_vendida) AS cantidad_vendida,
          MAX(dd.cantidad_devuelta) AS cantidad_devuelta
      FROM ventas v
      LEFT JOIN (
          SELECT SUM(cantidad) AS cantidad_vendida
          FROM venta_detalles
          WHERE created_at >= ?
            AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
      ) vd ON 1=1
      LEFT JOIN (
          SELECT COALESCE(SUM(cantidad),0) AS cantidad_devuelta
          FROM devoluciones
          WHERE created_at >= ?
            AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
      ) dd ON 1=1
      WHERE v.fecha >= ?
        AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY);
    `;

    const result = await this.dataSource.query(sql, [
      fecha,         // DATE(fecha_pago) = ?
      fechaInicio,   // venta_detalles created_at >=
      fechaInicio,   // DATE_ADD venta_detalles
      fechaInicio,   // devoluciones created_at >=
      fechaInicio,   // DATE_ADD devoluciones
      fechaInicio,   // v.fecha >=
      fechaInicio,   // DATE_ADD v.fecha
    ]);

    return result[0];
  }


  async obtenerResumenDespachosPorFecha(fecha: string) {
    // Ej: fecha = '2026-01-28'
    const fechaInicio = `${fecha} 00:00:00`;
    const sql = `
      SELECT 
          COALESCE(SUM(cantidad_asignada), 0) AS cantidad_asignada,
          COALESCE(SUM(cantidad_entregada), 0) AS cantidad_entregada,
          COALESCE(SUM(cantidad_restante), 0) AS cantidad_restante
      FROM despacho_detalles dd
      WHERE dd.created_at >= ?
        AND dd.created_at < DATE_ADD(?, INTERVAL 1 DAY);
    `;
    const result = await this.dataSource.query(sql, [
      fechaInicio,
      fechaInicio,
    ]);
    return result[0];
  }

  async resumenVentasClintes(fecha: string, rol: string, idchofer: string) {
      const fechaParam = fecha || new Date().toISOString().split('T')[0];
      const condicionChofer = rol != 'admin' ? ' and cc.id_chofer =? ' : ' ';
      const sql = `
      SELECT
          c.id,
          c.nombre,
          c.contacto,
          c.direccion,
          c.telefono,
          c.especial,

          (select COALESCE(sum(pagado),0)  FROM ventas v
          WHERE v.cliente_id =  c.id
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)) venta_contado_hoy,

          (select COALESCE(sum(total - pagado),0)  FROM ventas v
          WHERE v.cliente_id =  c.id
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)) deuda_acumulada,

           (SELECT COALESCE(SUM(d.cantidad), 0)
          FROM devoluciones d
          WHERE d.cliente_id = c.id
            AND d.created_at >= '2026-05-21 00:00:00'
            AND d.created_at < DATE_ADD('2026-05-21 00:00:00', INTERVAL 1 DAY)
          ) AS devolucion_hoy,

          (SELECT v.id
          FROM ventas v
          WHERE v.cliente_id = c.id
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          LIMIT 1
          ) AS id_venta

      FROM clientes c
      inner join clientes_chofer cc  on c.id = cc.id_cliente
      where c.activo = 1
       ${condicionChofer}
      ORDER BY c.created_at DESC;
      `;
      const params: any[] = [
        fechaParam, fechaParam,  // venta_contado_hoy
        fechaParam, fechaParam,  // deuda_acumulada
        fechaParam, fechaParam,  // id_venta
      ];
      if (rol != 'admin') params.push(idchofer);

      return this.dataSource.query(sql, params);
  }

  async ventasClienteRangoFecha(clienteId: number, fechaInicio: string, fechaFin: string) {
      const sql = `
        SELECT 
            id id_venta,
            DATE_FORMAT(fecha, '%Y-%m-%d') AS dia,
            SUM(pagado) AS total_contado,
            SUM(total - pagado) AS total_credito,
            SUM( pagado ) AS total_pagado
        FROM ventas
        WHERE cliente_id = ?
          AND fecha >= ?
          AND fecha < ?
        GROUP BY id, dia
        ORDER BY dia ASC;
      `;
      const result = await this.dataSource.query(sql, [
        clienteId,
        `${fechaInicio} 00:00:00`,
        `${fechaFin} 23:59:59`,
      ]);
      return result;
  } 

  async consultaVentaProductosClienteFecha(idcliente: number, fecha: string) {
    const sql = `
      select p.id, p.nombre, vd.cantidad, vd.precio_unitario, vd.subtotal
      from venta_detalles vd
      inner join ventas v on v.id=vd.venta_id
      inner join productos p on vd.producto_id = p.id
      where v.cliente_id = ? and DATE(v.fecha) = ?
    `;
    return this.dataSource.query(sql, [idcliente, fecha]);
  }

  async consultaCortesiaProductosClienteFecha(idcliente: number, fecha: string) {
    const sql = `
      select p.id, p.nombre, vd.cantidad, vd.precio_unitario, vd.subtotal
      from venta_detalles vd
      inner join ventas v on v.id=vd.venta_id
      inner join productos p on vd.producto_id = p.id
      where v.cliente_id = ? and DATE(v.fecha) = ?   and total = 0
    `;
    return this.dataSource.query(sql, [idcliente, fecha]);
  }

  async consultaDevolucionesProductosClienteFecha(idcliente: number, fecha: string) {
    const sql = `
       select  p.id, p.nombre, dd.cantidad_devuelta cantidad, 0 precio_unitario, 0 subtotal
        from devolucion_detalles dd 
        inner join devoluciones d on d.id  =dd.devolucion_id 
        inner join productos p on dd.producto_id = p.id
        where d.cliente_id = ? and DATE(d.fecha_devolucion) = ?  
      `;
    return this.dataSource.query(sql, [idcliente, fecha]);
  }

  async ventasTotalesPorDia() {
    const sql = `
        SELECT
            DATE(v.fecha) AS dia,
            SUM(v.total) AS total_ventas,
            SUM(COALESCE(v.pagado, 0)) AS recaudado,
            SUM(COALESCE(v.efectivo, 0)) AS total_efectivo,
            SUM(COALESCE(v.transferencia, 0)) AS total_transferencias,
            SUM(v.total - COALESCE(v.pagado, 0)) AS total_deuda
        FROM ventas v
        GROUP BY DATE(v.fecha)
        ORDER BY dia;
      `;
    return this.dataSource.query(sql);
  }

  async pagarVentaCredito(ventaId: number, monto: number) {
    const venta = await this.dataSource.getRepository(Ventas).findOneBy({ id: ventaId });
    if (!venta) { 
      throw new NotFoundException('Venta no encontrada');
    }

    venta.pagado = ( Number(venta.pagado) ?? 0) + monto;
    venta.fechaPago = new Date();
    await this.dataSource.getRepository(Ventas).save(venta);
    return CustomUtils.responseApi('Pago registrado con éxito', { ventaId: venta.id, montoPagado: monto });
  }

  
}
