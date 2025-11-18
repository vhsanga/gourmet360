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
import { UsuarioModule } from 'src/usuario/usuario.module';
import { Devoluciones } from 'src/entities/entities/Devoluciones';
import { DevolucionDetalles } from 'src/entities/entities/DevolucionDetalles';
import { Cambios } from 'src/entities/entities/Cambios';
import { CambioDetalles } from 'src/entities/entities/CambioDetalles';
import { CambiosService } from './services/cambios.service';

@Module({
  imports: [UsuarioModule,  TypeOrmModule.forFeature([Despachos, DespachoDetalles, Camiones, Productos, Ventas, VentaDetalles, Devoluciones, DevolucionDetalles, Cambios, CambioDetalles, ])],
  providers: [DespachoService, CamionService, ProductoServices, VentasService, CambiosService],
  controllers: [AdminController]
})
export class AdminModule {}
