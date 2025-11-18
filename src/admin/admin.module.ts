import { Module } from '@nestjs/common';
import { DespachoService } from './services/despacho.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despachos } from 'src/entities/entities/Despachos';
import { DespachoDetalles } from 'src/entities/entities/DespachoDetalles';
import { CamionService } from './services/camion.service';
import { Camiones } from 'src/entities/entities/Camiones';
import { ProductoServices } from './services/producto.services';
import { Productos } from 'src/entities/entities/Productos';
import { VentasService } from './services/ventas.service';
import { Ventas } from 'src/entities/entities/Ventas';
import { VentaDetalles } from 'src/entities/entities/VentaDetalles';

@Module({
  imports: [TypeOrmModule.forFeature([Despachos, DespachoDetalles, Camiones, Productos, Ventas, VentaDetalles])],
  providers: [DespachoService, CamionService, ProductoServices, VentasService],
  controllers: [AdminController]
})
export class AdminModule {}
