import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CambioDetalles } from 'src/entities/entities/CambioDetalles';
import { Cambios } from 'src/entities/entities/Cambios';
import { DespachoDetalles } from 'src/entities/entities/DespachoDetalles';
import { DevolucionDetalles } from 'src/entities/entities/DevolucionDetalles';
import { Devoluciones } from 'src/entities/entities/Devoluciones';
import { VentaDetalles } from 'src/entities/entities/VentaDetalles';
import { Ventas } from 'src/entities/entities/Ventas';
import { Repository } from 'typeorm';
import { CreateCambioDto } from '../dtos/create-cambio.dto';


@Injectable()
export class CambiosService {
  constructor(
    @InjectRepository(Cambios)
    private cambioRepo: Repository<Cambios>,

    @InjectRepository(CambioDetalles)
    private cambioDetalleRepo: Repository<CambioDetalles>,

    @InjectRepository(Devoluciones)
    private devolucionRepo: Repository<Devoluciones>,

    @InjectRepository(DevolucionDetalles)
    private devolucionDetalleRepo: Repository<DevolucionDetalles>,

    @InjectRepository(Ventas)
    private ventaRepo: Repository<Ventas>,

    @InjectRepository(VentaDetalles)
    private ventaDetalleRepo: Repository<VentaDetalles>,

    @InjectRepository(DespachoDetalles)
    private despachoDetalleRepo: Repository<DespachoDetalles>,
  ) {}

  async registrarCambio(dto: CreateCambioDto) {
   
    // 1️⃣ Registrar devolución
    let devolucion = this.devolucionRepo.create({
      choferId: dto.choferId,
      clienteId: dto.clienteId,
      fechaDevolucion: new Date(),
      observacion: dto.observacion,
    });
    

    devolucion =  await this.devolucionRepo.save(devolucion);

    // Crear registro de cambio
    const cambio = this.cambioRepo.create({
      devolucionId: devolucion.id,
      choferId: dto.choferId,
      fechaCambio: new Date(),
    });

    await this.cambioRepo.save(cambio);

    for (const item of dto.items) {
      // 2️⃣ Registrar la devolución detalle
      const devolucionDetalle = this.devolucionDetalleRepo.create({
        devolucionId: devolucion.id,
        productoId: item.productoId,
        cantidadDevuelta: item.cantidadDevuelta,
      });
      await this.devolucionDetalleRepo.save(devolucionDetalle);

      // 3️⃣ Registrar cambio detalle
      const cambioDetalle = this.cambioDetalleRepo.create({
        cambioId: cambio.id,
        productoId: item.productoId,
        cantidadEntregada: item.cantidadDevuelta
      });
      await this.cambioDetalleRepo.save(cambioDetalle);
    }

    return {
      message: 'Cambio registrado con éxito',
      cambioId: cambio.id,
    };
  }
}
