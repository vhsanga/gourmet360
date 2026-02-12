import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, Request } from '@nestjs/common';
import { UsuarioService } from './services/usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomUtils } from 'src/utils/custom_utils';
import { ClientesChoferService } from './services/cliente-chofer.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { DevolucionesService } from './services/devoluciones.services';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService, 
    private readonly clientesChoferService: ClientesChoferService,
    private readonly devolucionesService: DevolucionesService
  ) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    let data = await this.usuarioService.findAll();
    return CustomUtils.responseApi('Lista de usuarios', data);
  }

  @Get('data-home')
  async dataHome(@Query('idChofer') idChofer: number) {
    let despachoPendiente= await this.clientesChoferService.consultarDespachoPendientes(idChofer);
    let clientes= await this.clientesChoferService.listarClientesPorChofer(idChofer, despachoPendiente.id);
    let productos= await this.clientesChoferService.consultarProductosAsignadosByChoferId(idChofer);
    return CustomUtils.responseApi('Lista de clientes', {clientes, productos, despacho: despachoPendiente});
  }

  @Get('listar-clientes')
  async listarClientes(@Query('idChofer') idChofer: number) {
    let data= await this.clientesChoferService.listarAllClientesPorChofer(idChofer);
    return CustomUtils.responseApi('Lista de clientes', data);
  }

  @Get('listar-productos-asignados')
  async listarProductosAsignados(@Query('idChofer') idChofer: number) {
    let data= await this.clientesChoferService.consultarProductosAsignadosByChoferId(idChofer);
    return CustomUtils.responseApi('Lista de productos asiganados', data);
  }

  @Post('create-cliente')
  createCliente(@Body() createClienteDto: CreateClienteDto, @Request() req: any) {
    return this.clientesChoferService.createClienteChofer(createClienteDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOneByID(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

  @Post('ubicacion')
  async setUbicacionChofer(@Body('idChofer') idChofer: number, @Body('lat') lat: string, @Body('lng') lng: string) {
    console.log('idChofer', idChofer, lat, lng);
    await this.clientesChoferService.setUbicacionChofer(idChofer, lat, lng);
    return CustomUtils.responseApi('Ubicación actualizada correctamente', null);
  }

  @Post('devolucion')
  async registrarDevolucion(@Body('cantidad') cantidad: number, @Body('clienteId') clienteId: number, @Body('choferId') choferId: number) {
    const devolucion = await this.devolucionesService.guardarDevolucion(cantidad, clienteId, choferId);
    return CustomUtils.responseApi('Devolución registrada con éxito', devolucion);
  }

  @Get('devoluciones-cliente')
  async getDevolucionesClienteHoy(@Query('clienteId') clienteId: number) {
    const totalDevoluciones = await this.devolucionesService.getTotalDevolucionesPorClienteHoy(clienteId);
    return CustomUtils.responseApi('Total de devoluciones del cliente en las últimas 24 horas', { totalDevoluciones });
  }
}
