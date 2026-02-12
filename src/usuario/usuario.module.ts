import { Module } from '@nestjs/common';
import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from 'src/entities/entities/Usuarios';
import { ClientesChoferService } from './services/cliente-chofer.service';
import { ClientesChofer } from 'src/entities/entities/ClientesChofer';
import { DevolucionesService } from './services/devoluciones.services';
import { Devoluciones } from 'src/entities/entities/Devoluciones';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios, ClientesChofer, Devoluciones])],
  controllers: [UsuarioController],
  providers: [UsuarioService, ClientesChoferService, DevolucionesService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
