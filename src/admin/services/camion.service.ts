import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Camiones } from "src/entities/entities/Camiones";
import { DataSource, Repository } from "typeorm";
import { CreateCamionDto } from "../dtos/create-camion.dto";
import { Usuarios } from "src/entities/entities/Usuarios";
import { CustomUtils } from "src/utils/custom_utils";
import * as bcrypt from 'bcrypt';
import { UsuarioService } from "src/usuario/services/usuario.service";

@Injectable()
export class CamionService {
    constructor(
        @InjectRepository(Camiones) private camionRepository: Repository<Camiones>,
         private usuariosService: UsuarioService,
        private dataSource: DataSource,
    ){}

    async listarCamionesChofer() {
        return await this.camionRepository
            .createQueryBuilder('camion')
            .innerJoinAndSelect('usuarios', 'u', 'u.id = camion.chofer_id', { rol: 'chofer' })
            .select([
            'camion.id',
            'camion.placa',
            'camion.modelo',
            'camion.capacidad',
            'u.id',
            'u.nombre',
            'u.celular',
            ])
            .orderBy('camion.id', 'ASC')
            .getRawMany();
    }

    async registrarCamion(dto: CreateCamionDto, userId: number) {
        const existing = await this.usuariosService.findOneByCelular( dto.chofer.celular!);
        if (existing) {
            throw new ConflictException('El celular ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(dto.chofer.pin, 10);
        return await this.dataSource.transaction(async manager => {
            const nuevoChofer = manager.create(Usuarios, {
                nombre: dto.chofer.nombre,
                pin: hashedPassword,
                rol: dto.chofer.rol,
                celular: dto.chofer.celular,
                createdBy: userId,
            });
            const choferGuardado = await manager.save(Usuarios, nuevoChofer);
            const camion = manager.create(Camiones, {
                placa: dto.placa,
                marca: dto.marca,
                modelo: dto.modelo,
                capacidad: dto.capacidad,
                choferId: choferGuardado.id,
                createdBy: userId,
            });
            const camionGuardado = await manager.save(Camiones, camion);
            return CustomUtils.responseApi('Chofer registrados correctamente', {
                camion_id: camionGuardado.id,
                chofer_id: choferGuardado.id
            });
        });
    }
}