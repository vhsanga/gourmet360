import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clientes } from 'src/entities/entities/Clientes';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Clientes)
    private readonly clienteRepo: Repository<Clientes>,
  ) {}

  async listarClientes() {
    return await this.clienteRepo.find({ where: { activo: true } });
  }

  async findById(id: number) {
    const cliente = await this.clienteRepo.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  async eliminarCliente(id: number) {
    const cliente = await this.findById(id);
    cliente.activo = false;
    await this.clienteRepo.save(cliente);
  }
}
