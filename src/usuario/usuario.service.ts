import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from 'src/entities/entities/Usuarios';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor( 
    @InjectRepository(Usuarios) private readonly repo:Repository<Usuarios>,
  ){}
  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.repo.save(createUsuarioDto);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOneByID(id: number) {
    const usuario = await this.repo.findOne({where:{id}});
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return usuario;
  }

  async findOneByCelular(celular: string) {
    const usuario = await this.repo.findOne({where:{celular}});
    return usuario;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
