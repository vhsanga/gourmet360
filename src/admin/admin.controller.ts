import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
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
    return this.despachosService.crearDespacho(dto);
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
    return this.camionesService.registrarCamion(dto);
  }

  @Get('productos')
  async listarProductos() {
    const data = await this.productoService.listarProductos();
    return CustomUtils.responseApi('Lista de productos con categorias', data);
  }

  @Post('save-venta')
  registrarVenta(@Body() dto: CreateVentaDto, @Request() req) {
    return this.ventasService.registrarVenta(dto);
  }

  @Post('cambio-producto')
  registrarCambio(@Body() dto: CreateCambioDto) {
    return this.cambiosService.registrarCambio(dto);
  }

  @Get('dashboard-data-admin/:fecha')
  async getDashboardDataAdmin(@Param('fecha') fecha: string) {
    let resumenventas = await this.ventasService.obtenerResumenVentasPorFecha(fecha);
    let resumenDespachos = await this.ventasService.obtenerResumenDespachosPorFecha(fecha);
    return CustomUtils.responseApi('Dashboard data', {
      ventas: resumenventas,
      despachos: resumenDespachos
    });
  }

  @Get('resumen-despachos-chofer/:choferId')
  async getResumenDespachosPorChofer(@Param('choferId') choferId: number) {
    const despachos = await this.camionesService.obtenerResumenDespachosPorChofer(choferId);
    const cuentasPorCobrar = await this.camionesService.obtenerCuentasPorCobrarChofer(choferId);
    const devoluciones = await this.camionesService.obtenerResumenDevolucionesPorChofer(choferId);
    const ventasHoy = await this.camionesService.obtenerResumenVentasPorChoferHoy(choferId);
    
    return CustomUtils.responseApi('Resumen de despachos por chofer', {
      despachos,
      devoluciones,
      ventasHoy,
      cuentasPorCobrar
    });
  }

  @Post('set-despacho-entregado/:choferId')
  async setDespachoEntregado(@Param('choferId') choferId: number) {
    await this.camionesService.setDepachoEntregadoPorChofer(choferId);
    return CustomUtils.responseApi('Despachos actualizados a entregados para el chofer', {});
  }

  @Get('resumen-ventas-clientes')
  async getResumenVentasPorClientes() {
    const data = await this.ventasService.resumenVentasClintes();
    return CustomUtils.responseApi('Resumen de ventas por clientes', data);
  }

}
