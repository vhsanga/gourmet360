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
            'camion.chofer_id',
            'camion.placa',
            'camion.marca',
            'camion.modelo',
            'camion.capacidad',
            'u.id',
            'u.nombre',
            'u.celular',
            ])
            .orderBy('camion.id', 'ASC')
            .getRawMany();
    }

    async registrarCamion(dto: CreateCamionDto) {
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
            });
            const choferGuardado = await manager.save(Usuarios, nuevoChofer);
            const camion = manager.create(Camiones, {
                placa: dto.placa,
                marca: dto.marca,
                modelo: dto.modelo,
                capacidad: dto.capacidad,
                choferId: choferGuardado.id,
            });
            const camionGuardado = await manager.save(Camiones, camion);
            return CustomUtils.responseApi('Chofer registrados correctamente', {
                camion_id: camionGuardado.id,
                chofer_id: choferGuardado.id
            });
        });
    }

    async setDepachoEntregadoPorChofer(choferId: number) {
        const sql = `
        update despachos set estado = 'finalizado' where chofer_id = ? and estado = 'pendiente'
        `;
        await this.dataSource.query(sql, [choferId]);
    }

    async obtenerResumenDespachosPorChofer(choferId: number) {
        const sql = `
        select sum(dd.cantidad_asignada) cantidad_asignada, sum(dd.cantidad_entregada) cantidad_entregada, sum(dd.cantidad_restante)cantidad_restante from despacho_detalles dd 
        inner join despachos d on d.id = dd.despacho_id 
        where d.estado ='pendiente' and d.chofer_id  = ?
        `;
        const result = await this.dataSource.query(sql, [
        choferId
        ]);
        return result[0];
    }

    async obtenerResumenDevolucionesPorChofer(choferId: number) {
        const sql = `
        select coalesce ( sum(dd.cantidad_devuelta), 0) cantidad_devuelta from devolucion_detalles dd
            inner join  devoluciones d on d.id = dd.devolucion_id 
            where  d.chofer_id = ? 
            AND d.created_at >= CURDATE()
            AND d.created_at < CURDATE() + INTERVAL 1 DAY;
        `;
        const result = await this.dataSource.query(sql, [
        choferId
        ]);
        return result[0];
    }

    async obtenerResumenVentasPorChoferHoy(choferId: number) {
        const sql = `
         SELECT
            COALESCE(SUM(CASE WHEN v.tipo_pago = 'credito' THEN v.total END), 0) AS ventas_credito,
            COALESCE(SUM(CASE WHEN v.tipo_pago = 'contado' THEN v.total END), 0) AS ventas_contado
            FROM ventas v
            JOIN despachos d ON v.despacho_id = d.id
            WHERE d.chofer_id = ?
            AND d.created_at >= CURDATE()
            AND d.created_at < CURDATE() + INTERVAL 1 DAY;
        `;
        const result = await this.dataSource.query(sql, [
        choferId
        ]);
        return result[0];
    } 

    async obtenerCuentasPorCobrarChofer(choferId: number) {
        const sql = `
         select sum(total) cuentas_por_cobrar from  ventas v
            JOIN despachos d ON v.despacho_id = d.id
            WHERE d.chofer_id = ? and v.tipo_pago ='credito' 
        `;
        const result = await this.dataSource.query(sql, [
        choferId
        ]);
        return result[0];
    } 
}