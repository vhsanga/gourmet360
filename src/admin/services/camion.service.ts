import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Camiones } from "src/entities/entities/Camiones";
import { Repository } from "typeorm";

@Injectable()
export class CamionService {
    constructor(
        @InjectRepository(Camiones) private camionRepository: Repository<Camiones>,
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
}