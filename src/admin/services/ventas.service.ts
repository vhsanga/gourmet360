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
      venta.tipoPago = dto.tipoPago;
      venta.total = dto.total;
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
          await queryRunner.manager.save(ClienteProducto, clienteProducto);
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
          SUM(CASE WHEN v.tipo_pago = 'contado' THEN v.total ELSE 0 END)
          + COALESCE((
              SELECT SUM(pagado)
              FROM ventas
              WHERE DATE(fecha_pago) = ?
                AND tipo_pago = 'credito'
          ), 0) AS total_ventas_contado,
          SUM(CASE WHEN v.tipo_pago = 'credito' THEN v.total ELSE 0 END) AS total_ventas_credito,
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

  async resumenVentasClintes(fecha?: string) {
      const fechaParam = fecha || new Date().toISOString().split('T')[0];
      const sql = `
      SELECT 
          c.id,  
          c.nombre, 
          c.contacto, 
          c.direccion, 
          c.telefono, 
          c.especial,

          (SELECT COALESCE(SUM(
              CASE 
                  WHEN v.pagado IS NOT NULL THEN v.pagado
                  ELSE v.total
              END
          ), 0)
          FROM ventas v 
          WHERE v.cliente_id = c.id 
            AND (v.tipo_pago = 'contado' or v.pagado is not null )
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS venta_contado_hoy,

          (SELECT COALESCE(SUM(v.total - COALESCE(v.pagado, 0)), 0) 
          FROM ventas v 
          WHERE v.cliente_id = c.id 
            AND v.tipo_pago = 'credito' 
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS deuda_acumulada,

          (SELECT COALESCE(SUM(d.cantidad), 0) 
          FROM devoluciones d  
          WHERE d.cliente_id = c.id 
            AND d.created_at >= ?
            AND d.created_at < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS devolucion_hoy,

          (SELECT v.id
          FROM ventas v 
          WHERE v.cliente_id = c.id 
            AND v.tipo_pago = 'credito' 
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          LIMIT 1
          ) AS id_venta

      FROM clientes c;
      `;
      const result = await this.dataSource.query(sql, [
        fechaParam,
        fechaParam,
        fechaParam,
        fechaParam,
        fechaParam,
        fechaParam,
        fechaParam,
        fechaParam,
      ]);
      return result;
  } 

  async ventasClienteRangoFecha(clienteId: number, fechaInicio: string, fechaFin: string) {
      const sql = `
        SELECT 
            id id_venta,
            DATE_FORMAT(fecha, '%Y-%m-%d') AS dia,
            SUM(CASE WHEN tipo_pago = 'contado' THEN total ELSE 0 END) AS total_contado,
            SUM(CASE WHEN tipo_pago = 'credito' THEN total ELSE 0 END) AS total_credito,
             SUM(CASE WHEN tipo_pago = 'credito' THEN pagado  ELSE 0 END) AS total_pagado
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

  async pagarVentaCredito(ventaId: number, monto: number) {
    const venta = await this.dataSource.getRepository(Ventas).findOneBy({ id: ventaId });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }
    if (venta.tipoPago !== 'credito') {
      throw new BadRequestException('La venta no es de tipo crédito');
    }
    venta.pagado = ( Number(venta.pagado) ?? 0) + monto;
    venta.fechaPago = new Date();
    await this.dataSource.getRepository(Ventas).save(venta);
    return CustomUtils.responseApi('Pago registrado con éxito', { ventaId: venta.id, montoPagado: monto });
  }

  
}
