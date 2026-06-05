import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateDespachoDto } from '../dtos/create-despacho.dto';
import { Despachos } from 'src/entities/entities/Despachos';
import { DespachoDetalles } from 'src/entities/entities/DespachoDetalles';
import { CustomUtils } from 'src/utils/custom_utils';
import { GastoDespacho } from 'src/entities/entities/GastoDespacho';
import { UpsertGastoDespachoDto } from '../dtos/create-registro-gasto.dto';

@Injectable()
export class DespachoService {
    constructor(
    @InjectRepository(Despachos) private despachoRepo: Repository<Despachos>,
    @InjectRepository(DespachoDetalles) private detalleRepo: Repository<DespachoDetalles>,
    @InjectRepository(GastoDespacho) private gastoDespachoRepo: Repository<GastoDespacho>,
    
    private dataSource: DataSource,
  ) {}

  async crearDespacho(dto: CreateDespachoDto) {
    return await this.dataSource.transaction(async (manager) => {
      const despachoActivo = await manager.findOne(Despachos, {
        where: { choferId: dto.chofer_id, estado: In(['pendiente', 'en_ruta']) },
        relations: ['despachoDetalles'],
      });

      if (despachoActivo) {
        const detallesExistentes = despachoActivo.despachoDetalles ?? [];

        for (const det of dto.detalles) {
          const detalleExistente = detallesExistentes.find(
            d => Number(d.productoId) === det.producto_id,
          );

          if (detalleExistente) {
            detalleExistente.cantidadAsignada = Number(detalleExistente.cantidadAsignada) + det.cantidad;
            detalleExistente.cantidadRestante = Number(detalleExistente.cantidadRestante) + det.cantidad;
            await manager.save(DespachoDetalles, detalleExistente);
          } else {
            const nuevoDetalle = manager.create(DespachoDetalles, {
              despachoId: despachoActivo.id,
              productoId: det.producto_id,
              cantidadAsignada: det.cantidad,
              cantidadRestante: det.cantidad,
              cantidadEntregada: 0,
            });
            await manager.save(DespachoDetalles, nuevoDetalle);
          }
        }

        return CustomUtils.responseApi('Stock actualizado en despacho activo', { despacho_id: despachoActivo.id });
      }

      const despacho = manager.create(Despachos, {
        camionId: dto.camion_id,
        choferId: dto.chofer_id,
        fecha: new Date().toISOString().split('T')[0],
      });

      const despachoGuardado = await manager.save(Despachos, despacho);

      const detalles = dto.detalles.map(det =>
        manager.create(DespachoDetalles, {
          despachoId: despachoGuardado.id,
          productoId: det.producto_id,
          cantidadAsignada: det.cantidad,
          cantidadRestante: det.cantidad,
          cantidadEntregada: 0,
        }),
      );
      await manager.save(DespachoDetalles, detalles);
      return CustomUtils.responseApi('Despacho registrado correctamente', { despacho_id: despachoGuardado.id });
    });
  }

  async actualizarGastoDespacho(dto: UpsertGastoDespachoDto) {
    const { idDespacho, idChofer, gastos } = dto;

    const despacho = await this.despachoRepo.findOne({ where: { id: idDespacho } });
    if (!despacho) throw new Error('Despacho no encontrado');

    const sumaGasto = gastos.reduce((acc, item) => acc + item.valor, 0);
    despacho.gastos = sumaGasto;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(Despachos, despacho);
      await manager.delete(GastoDespacho, { idDespacho });
      const detalles = gastos.map(item =>
        manager.create(GastoDespacho, {
          idDespacho,
          idChofer,
          detalle: item.detalle,
          valor: item.valor,
        })
      );
      await manager.save(GastoDespacho, detalles);
    });
  }

  async obtenerDetallePRoductosRestantes(choferId: number) {
        const sql = `
         select dd.cantidad_restante, dd.producto_id, p.nombre 
          from despacho_detalles dd 
          inner join despachos d on dd.despacho_id  =d.id 
          inner join productos p on dd.producto_id = p.id
          where d.estado ='pendiente' and d.chofer_id =?
        `;
        const result = await this.dataSource.query(sql, [
        choferId
        ]);
        return result;
    } 
}