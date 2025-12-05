import { Module } from '@nestjs/common';
import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from 'src/entities/entities/Usuarios';
import { ClientesChoferService } from './services/cliente-chofer.service';
import { ClientesChofer } from 'src/entities/entities/ClientesChofer';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios, ClientesChofer])],
  controllers: [UsuarioController],
  providers: [UsuarioService, ClientesChoferService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
