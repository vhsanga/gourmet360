import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { DespachoService } from './services/despacho.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDespachoDto } from './dtos/create-despacho.dto';
import { CamionService } from './services/camion.service';
import { ProductoServices } from './services/producto.services';
import { CustomUtils } from 'src/utils/custom_utils';
import { CreateVentaDto } from './dtos/create-venta.dto';
import { VentasService } from './services/ventas.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor(
      private readonly despachosService: DespachoService,
      private readonly camionesService: CamionService,
      private readonly productoService: ProductoServices,
      private ventasService: VentasService
    ) {}

  
  @Post('create-despacho')
  crear(@Body() dto: CreateDespachoDto, @Request() req) {
    const userId = req.user.userId; // viene del token JWT
    return this.despachosService.crearDespacho(dto, userId);
  }

  @Get('camiones')
  async listarCamiones() {
    const data = await this.camionesService.listarCamionesChofer();
    return CustomUtils.responseApi('Lista de camiones con choferes', data);
  }

  @Get('productos')
  async listarProductos() {
    const data = await this.productoService.listarProductos();
    return CustomUtils.responseApi('Lista de productos con categorias', data);
  }

  @Post('save-venta')
  registrarVenta(@Body() dto: CreateVentaDto, @Request() req) {
    const userId = req.user.userId; 
    return this.ventasService.registrarVenta(dto, userId);
  }
}
