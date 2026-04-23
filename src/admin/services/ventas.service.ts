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
          SUM(CASE WHEN v.tipo_pago = 'contado' THEN v.total ELSE 0 END) AS total_ventas_contado,
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
      fechaInicio,
      fechaInicio,
      fechaInicio,
      fechaInicio,
      fechaInicio,
      fechaInicio,
    ]);

    return result[0]; // viene como array
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
          c.id, c.nombre, c.contacto, c.direccion, c.telefono, c.especial,

          (SELECT COALESCE(SUM(total), 0) 
          FROM ventas v 
          WHERE v.cliente_id = c.id 
            AND tipo_pago = 'contado' 
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS venta_contado_hoy,

          (SELECT COALESCE(SUM(total), 0) 
          FROM ventas v 
          WHERE v.cliente_id = c.id 
            AND tipo_pago = 'credito' 
            AND v.fecha >= ?
            AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS deduda_acumulada,

          (SELECT COALESCE(SUM(d.cantidad), 0) 
          FROM devoluciones d  
          WHERE d.cliente_id = c.id 
            AND d.created_at >= ?
            AND d.created_at < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS devolucion_hoy

      FROM clientes c;
      `;
      const result = await this.dataSource.query(sql, [
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
            DATE_FORMAT(fecha, '%Y-%m-%d') AS dia,
            SUM(CASE WHEN tipo_pago = 'contado' THEN total ELSE 0 END) AS total_contado,
            SUM(CASE WHEN tipo_pago = 'credito' THEN total ELSE 0 END) AS total_credito
        FROM ventas
        WHERE cliente_id = ?
          AND fecha >= ?
          AND fecha < ?
        GROUP BY dia
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
    venta.pagado = (venta.pagado ?? 0) + monto;
    venta.fechaPago = new Date();
    await this.dataSource.getRepository(Ventas).save(venta);
    return CustomUtils.responseApi('Pago registrado con éxito', { ventaId: venta.id, montoPagado: monto });
  }
}
