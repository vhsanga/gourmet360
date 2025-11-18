import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { DespachoService } from './services/despacho.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDespachoDto } from './dtos/create-despacho.dto';
import { CamionService } from './services/camion.service';
import { ProductoServices } from './services/producto.services';
import { CustomUtils } from 'src/utils/custom_utils';
import { CreateVentaDto } from './dtos/create-venta.dto';
import { VentasService } from './services/ventas.service';
import { CreateCamionDto } from './dtos/create-camion.dto';
import { CambiosService } from './services/cambios.service';
import { CreateCambioDto } from './dtos/create-cambio.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor(
      private readonly despachosService: DespachoService,
      private readonly camionesService: CamionService,
      private readonly productoService: ProductoServices,
      private readonly cambiosService: CambiosService,
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


  @Post('registrar-conductor')
  async registrarCamion(
    @Body() dto: CreateCamionDto,
    @Req() req: any
  ) {
    const userId = req.user.id; // viene del token
    return this.camionesService.registrarCamion(dto, userId);
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

  @Post('cambio-producto')
  registrarCambio(@Body() dto: CreateCambioDto) {
    return this.cambiosService.registrarCambio(dto);
  }

}
