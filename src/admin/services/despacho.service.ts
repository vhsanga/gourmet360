import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateDespachoDto } from '../dtos/create-despacho.dto';
import { Despachos } from 'src/entities/entities/Despachos';
import { DespachoDetalles } from 'src/entities/entities/DespachoDetalles';
import { CustomUtils } from 'src/utils/custom_utils';

@Injectable()
export class DespachoService {
    constructor(
    @InjectRepository(Despachos) private despachoRepo: Repository<Despachos>,
    @InjectRepository(DespachoDetalles) private detalleRepo: Repository<DespachoDetalles>,
    private dataSource: DataSource,
  ) {}

  async crearDespacho(dto: CreateDespachoDto) {
    
    return await this.dataSource.transaction(async (manager) => {
      // Crear encabezado del despacho
      const despacho = manager.create(Despachos, {
        camionId: dto.camion_id,
        choferId: dto.chofer_id,
        fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      });

      const despachoGuardado = await manager.save(Despachos, despacho);

      // Crear detalles
      const detalles = dto.detalles.map(det => {
        return manager.create(DespachoDetalles, {
          despachoId: despachoGuardado.id,
          productoId: det.producto_id,
          cantidadAsignada: det.cantidad,
          cantidadRestante: det.cantidad, 
          cantidadEntregada: 0,   
        });
      });
      await manager.save(DespachoDetalles, detalles);
      return CustomUtils.responseApi('Despacho registrado correctamente', {despacho_id: despachoGuardado.id});
    });
  }

  async actualizarGastoDespacho(despachoId: number, gastos: number) {
    const despacho = await this.despachoRepo.findOne({where: {id: despachoId}});
    if (!despacho) {
      throw new Error('Despacho no encontrado');
    } 
    despacho.gastos = gastos;
    await this.despachoRepo.save(despacho);
    return CustomUtils.responseApi('Gastos guardado correctamente');
  }
}