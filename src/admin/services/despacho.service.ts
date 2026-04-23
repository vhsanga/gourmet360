import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateDespachoDto } from '../dtos/create-despacho.dto';
import { Despachos } from 'src/entities/entities/Despachos';
import { DespachoDetalles } from 'src/entities/entities/DespachoDetalles';
import { CustomUtils } from 'src/utils/custom_utils';
import { GastoDespacho } from 'src/entities/entities/GastoDespacho';
import { GastoDetalleItemDto } from '../dtos/create-registro-gasto.dto';

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

  async actualizarGastoDespacho(gastosDetalle: GastoDetalleItemDto[]) {
    if(gastosDetalle.length == 0){
      throw new Error('No hay detalles'); 
    }
    const despachoId = gastosDetalle[0].idDespacho;
    var sumaGasto = 0;
    gastosDetalle.map( (item)=>{
      sumaGasto+= item.valor;
    });
    
    const despacho = await this.despachoRepo.findOne({where: {id: despachoId}});
    if (!despacho) {
      throw new Error('Despacho no encontrado');
    } 
    despacho.gastos = sumaGasto;
    await this.despachoRepo.save(despacho);

    return await this.dataSource.transaction(async (manager) => {
    const detalles = gastosDetalle.map(det => {
        return manager.create(GastoDespacho, {
          idDespacho: det.idDespacho,
          idChofer: det.idChofer,
          detalle: det.detalle,
          valor: det.valor  
        });
      });
      
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