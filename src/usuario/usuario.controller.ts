import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsuarioService } from './services/usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomUtils } from 'src/utils/custom_utils';
import { ClientesChoferService } from './services/cliente-chofer.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService, private readonly clientesChoferService: ClientesChoferService,) {}

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
    let clientes= await this.clientesChoferService.listarClientesPorChofer(idChofer);
    let productos= await this.clientesChoferService.consultarProductosAsignadosByChoferId(idChofer);
    return CustomUtils.responseApi('Lista de clientes', {clientes, productos});
  }

  @Get('listar-clientes')
  async listarClientes(@Query('idChofer') idChofer: number) {
    let data= await this.clientesChoferService.listarClientesPorChofer(idChofer);
    return CustomUtils.responseApi('Lista de clientes', data);
  }

  @Get('listar-productos-asignados')
  async listarProductosAsignados(@Query('idChofer') idChofer: number) {
    let data= await this.clientesChoferService.consultarProductosAsignadosByChoferId(idChofer);
    return CustomUtils.responseApi('Lista de productos asiganados', data);
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
}
