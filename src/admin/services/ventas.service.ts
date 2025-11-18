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

  async registrarVenta(dto: CreateVentaDto, userId: number) {
    const { idCliente, idDespacho, detalles } = dto;

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
      venta.createdBy = userId;
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

        if (despachoDetalle.cantidadRestante < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente del producto ${item.idProducto}. Disponible: ${despachoDetalle.cantidadRestante}`,
          );
        }

        // 4.1 — Descontar stock
        despachoDetalle.cantidadRestante -= item.cantidad;
        despachoDetalle.cantidadEntregada =  Number(despachoDetalle.cantidadEntregada) + Number(item.cantidad);
        await queryRunner.manager.save(DespachoDetalles, despachoDetalle);

        // 4.2 — Guardar detalle de venta
        const detalleVenta = new VentaDetalles();
        detalleVenta.ventaId = ventaGuardada.id;
        detalleVenta.productoId = item.idProducto;
        detalleVenta.cantidad = item.cantidad;
        detalleVenta.precioUnitario = item.precioUnitario;
        detalleVenta.createdBy = userId;

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
}
