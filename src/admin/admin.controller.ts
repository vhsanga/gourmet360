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
import { CreateProductoDto } from './dtos/create-producto.dto';
import { CategoriaServices } from './services/categoria.services';
import { GastoDetalleItemDto } from './dtos/create-registro-gasto.dto';

@Controller('admin')
export class AdminController {
    constructor(
      private readonly despachosService: DespachoService,
      private readonly camionesService: CamionService,
      private readonly productoService: ProductoServices,
      private readonly cambiosService: CambiosService,
      private readonly categoriaService: CategoriaServices,
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
    const fechaAsignacion = await this.camionesService.obtenerFechaUltimoDespachoPendientePorChofer(choferId);
    
    return CustomUtils.responseApi('Resumen de despachos por chofer', {
      despachos,
      devoluciones,
      ventasHoy,
      cuentasPorCobrar,      
      fechaUltimoDespachoPendiente: fechaAsignacion ? fechaAsignacion.fecha : null
    });
  }

  @Post('set-despacho-entregado/:choferId')
  async setDespachoEntregado(@Param('choferId') choferId: number) {
    await this.camionesService.setDepachoEntregadoPorChofer(choferId);
    return CustomUtils.responseApi('Despachos actualizados a entregados para el chofer', {});
  }

  @Get('resumen-ventas-clientes/:fecha')
  async getResumenVentasPorClientes(@Param('fecha') fecha: string) {
    const data = await this.ventasService.resumenVentasClintes(fecha);
    return CustomUtils.responseApi('Resumen de ventas por clientes', data);
  }

  @Post('update-gasto-despacho')
  async updateGastoDespacho( @Body('gastos') gastosDetalle: GastoDetalleItemDto[]) {
    await this.despachosService.actualizarGastoDespacho(gastosDetalle);
    return CustomUtils.responseApi('Gastos guardado correctamente');
  }

  @Post('ventas-cliente-rango')
  async ventasClienteRangoFecha( @Body('idcliente') clienteId: number, @Body('finicio') fechaInicio: string, @Body('ffin') fechaFin: string) {
    const data = await this.ventasService.ventasClienteRangoFecha(clienteId, fechaInicio, fechaFin);
    return CustomUtils.responseApi('Ventas a un cliente en un rango de fechas', data);
  }

  @Post('crear-producto')
  async crearProducto(@Body() dto: CreateProductoDto) {
    const producto = await this.productoService.crearProducto(dto);
    return CustomUtils.responseApi('Producto creado exitosamente', producto);
  }

  
  @Post('crear-categoria')
  async crearCategoria(@Body('nombre') nombre: string) {
    const categoria = await this.categoriaService.crearCategoria(nombre);
    return CustomUtils.responseApi('Categoría creada exitosamente', categoria);
  }

  @Get('listar-categorias')
  async listarCategorias() {
    const categorias = await this.categoriaService.listarCategorias();
    return CustomUtils.responseApi('Lista de categorías', categorias);
  }

  @Get('detalle-productos-restantes/:idchofer')
  async obtenerDetallePRoductosRestantes(@Param('idchofer') idchofer: number) {
    const categorias = await this.despachosService.obtenerDetallePRoductosRestantes(idchofer);
    return CustomUtils.responseApi('Lista de categorías', categorias);
  }

  @Post('pagar-venta-credito')
  async pagarVentaCredito(@Body('ventaId')  ventaId: number, @Body('monto') monto: number) {
    const pago = await this.ventasService.pagarVentaCredito(ventaId, monto);
    return pago;
  }

  

}
