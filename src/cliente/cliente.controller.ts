import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ClienteService } from './services/cliente.service';
import { CustomUtils } from 'src/utils/custom_utils';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  async listarClientes() {
    const data = await this.clienteService.listarClientes();
    return CustomUtils.responseApi('Lista de clientes', data);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.clienteService.findById(+id);
    return CustomUtils.responseApi('Cliente encontrado', data);
  }

  @Post('eliminar')
  async eliminarCliente(@Body('id') id: number) {
    await this.clienteService.eliminarCliente(id);
    return CustomUtils.responseApi('Cliente eliminado correctamente', null);
  }
}
