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
import { Deuda } from 'src/entities/entities/Deuda';
import { CobroDeuda } from 'src/entities/entities/CobroDeuda';

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

      const saldoPendiente = Number(dto.total) - Number(dto.pagado ?? 0);

      if (saldoPendiente > 0) { // guardar una deuda si el cliente no pagó todo
          const deuda = new Deuda();
          deuda.ventaId = ventaGuardada.id;
          deuda.clienteId = idCliente;
          deuda.valorTotal = dto.total;
          deuda.valorCobrado = dto.pagado ?? 0;
          deuda.pagoInicial = dto.pagado ?? 0;
          deuda.saldoPendiente = saldoPendiente;
          deuda.estado =
              dto.pagado > 0
                  ? 'PARCIAL'
                  : 'PENDIENTE';
          deuda.createdBy = idChofer;
          await queryRunner.manager.save(Deuda, deuda);
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
          COALESCE(
              SUM(
                  CASE
                      WHEN d.id IS NULL
                      THEN v.total
                      ELSE d.pago_inicial 
                  END
              ),
          0) AS total_ventas_contado,
          COALESCE(SUM(d.saldo_pendiente), 0) AS total_ventas_credito,
          MAX(vd.cantidad_vendida) AS cantidad_vendida,
          MAX(dd.cantidad_devuelta) AS cantidad_devuelta
      FROM ventas v
        LEFT JOIN deuda d
            ON d.id_venta = v.id
        LEFT JOIN (
            SELECT
                SUM(cantidad) AS cantidad_vendida
            FROM venta_detalles
            WHERE created_at >= ?
              AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
        ) vd ON 1 = 1
        LEFT JOIN (
            SELECT
                COALESCE(SUM(cantidad),0) AS cantidad_devuelta
            FROM devoluciones
            WHERE created_at >= ?
              AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
        ) dd ON 1 = 1
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
    const condicionChofer = rol != 'admin' ? ' and cc.id_chofer = ? ' : '';

    const sql = `
      SELECT
          c.id,
          c.nombre,
          c.contacto,
          c.direccion,
          c.telefono,
          c.especial,

          (
              SELECT COALESCE(
                  SUM(
                      CASE
                          WHEN d.id IS NULL
                          THEN v.total
                          ELSE d.pago_inicial
                      END
                  ),0)
              FROM ventas v
              LEFT JOIN deuda d
                  ON d.id_venta = v.id
              WHERE v.cliente_id = c.id
                AND v.fecha >= ?
                AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS venta_contado_hoy,

          (
            SELECT COALESCE(SUM(d.saldo_pendiente), 0)
            FROM deuda d
              INNER JOIN ventas v
                  ON v.id = d.id_venta
              WHERE v.cliente_id = c.id
                AND d.saldo_pendiente > 0
          ) AS deuda_acumulada,

          (
              SELECT COALESCE(SUM(dev.cantidad),0)
              FROM devoluciones dev
              WHERE dev.cliente_id = c.id
                AND dev.created_at >= ?
                AND dev.created_at < DATE_ADD(?, INTERVAL 1 DAY)
          ) AS devolucion_hoy,

          (
              SELECT v.id
              FROM ventas v
              WHERE v.cliente_id = c.id
                AND v.fecha >= ?
                AND v.fecha < DATE_ADD(?, INTERVAL 1 DAY)
              LIMIT 1
          ) AS id_venta

      FROM clientes c
      INNER JOIN clientes_chofer cc
          ON c.id = cc.id_cliente

      WHERE c.activo = 1
        ${condicionChofer}

      ORDER BY c.created_at DESC;
    `;

    const params: any[] = [
      // venta_contado_hoy
      fechaParam,
      fechaParam,

      // devolucion_hoy
      fechaParam,
      fechaParam,

      // id_venta
      fechaParam,
      fechaParam,

    ];

    if (rol !== 'admin') {
      params.push(idchofer);
    }
    return this.dataSource.query(sql, params);
  }

  async ventasClienteRangoFecha(  clienteId: number, fechaInicio: string, fechaFin: string ) {
      const sql = `
        SELECT
            v.id AS id_venta,
            DATE_FORMAT(v.fecha, '%Y-%m-%d') AS dia,
            CASE
                WHEN d.id IS NULL
                    THEN v.total
                ELSE d.pago_inicial
            END AS total_contado,
            CASE
                WHEN d.id IS NULL
                    THEN 0
                ELSE (d.valor_total - d.pago_inicial)
            END AS total_credito,
            CASE
                WHEN d.id IS NULL
                    THEN v.total
                ELSE d.valor_cobrado
            END AS total_pagado
        FROM ventas v
        LEFT JOIN deuda d
            ON d.id_venta = v.id
        WHERE v.cliente_id = ?
          AND v.fecha >= ?
          AND v.fecha <= ?
        ORDER BY v.fecha ASC;
      `;

      return await this.dataSource.query(sql, [
        clienteId,
        `${fechaInicio} 00:00:00`,
        `${fechaFin} 23:59:59`,
      ]);
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
            SUM(
                CASE
                    WHEN d.id IS NULL
                    THEN v.total
                    ELSE d.pago_inicial
                END
            ) AS recaudado,
            SUM(COALESCE(v.efectivo, 0)) AS total_efectivo,
            SUM(COALESCE(v.transferencia, 0)) AS total_transferencias,
            SUM(
                CASE
                    WHEN d.id IS NULL
                    THEN 0
                    ELSE (d.valor_total - d.pago_inicial)
                END
            ) AS total_deuda
        FROM ventas v
        LEFT JOIN deuda d
            ON d.id_venta = v.id
        GROUP BY DATE(v.fecha)
        ORDER BY dia;
    `;
    return this.dataSource.query(sql);
  }

  async pagarVentaCredito(
    ventaId: number,
    monto: number,
    choferId: number,
    tipoPago: string
  ) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = await queryRunner.manager.findOne(Ventas, {
        where: { id: ventaId },
      });

      if (!venta) {
        throw new NotFoundException('Venta no encontrada');
      }

      const deuda = await queryRunner.manager.findOne(Deuda, {
        where: { ventaId: ventaId },
      });

      if (!deuda) {
        throw new NotFoundException('La venta no tiene una deuda registrada.');
      }

      if (deuda.estado === 'PAGADA') {
        throw new BadRequestException('La deuda ya fue cancelada.');
      }

      if (monto <= 0) {
        throw new BadRequestException('El monto debe ser mayor a cero.');
      }

      if (monto > Number(deuda.saldoPendiente)) {
        throw new BadRequestException(
          `El monto supera el saldo pendiente (${deuda.saldoPendiente}).`,
        );
      }

      // Registrar el cobro
      const cobro = new CobroDeuda();
      cobro.idDeuda = deuda.id;
      cobro.valorCobrado = monto;
      cobro.idChofer = choferId;
      cobro.tipoPago = tipoPago; // o recibirlo como parámetro
      cobro.fechaCobro = new Date();
      await queryRunner.manager.save(CobroDeuda, cobro);

      // Actualizar deuda
      deuda.valorCobrado = Number(deuda.valorCobrado) + Number(monto);
      deuda.saldoPendiente = Number(deuda.valorTotal) - Number(deuda.valorCobrado);
      deuda.fechaUltimoCobro = new Date();
      deuda.estado = deuda.saldoPendiente <= 0? 'PAGADA' : 'PARCIAL';
      await queryRunner.manager.save(Deuda, deuda);

      await queryRunner.commitTransaction();

      return CustomUtils.responseApi(
        'Pago registrado con éxito',
        {
          ventaId: venta.id,
          deudaId: deuda.id,
          montoPagado: monto,
          saldoPendiente: deuda.saldoPendiente,
          estado: deuda.estado,
        },
      );

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release()
    }
  }

  
}
