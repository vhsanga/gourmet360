import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Devoluciones } from "src/entities/entities/Devoluciones";
import { DataSource, Repository } from "typeorm";
import { CreateDevolucionDto } from "../dto/create-devolucion.dto";
import { DevolucionDetalles } from "src/entities/entities/DevolucionDetalles";
import { CustomUtils } from "src/utils/custom_utils";

@Injectable()
export class DevolucionesService {
    constructor(
        @InjectRepository(Devoluciones) private readonly devolucionesRepo: Repository<Devoluciones>,
        private dataSource: DataSource,
    ) {}
    
    async guardarDevolucion( dto:CreateDevolucionDto) {
        console.log('Iniciando proceso de registro de devolución con DTO:', dto);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const devolucion = new Devoluciones();
            devolucion.cantidad = dto.cantidad;
            devolucion.clienteId = dto.clienteId;
            devolucion.choferId = dto.choferId;
            devolucion.fechaDevolucion = new Date();
            console.log('Guardando devolucion:', devolucion);
            await this.devolucionesRepo.save(devolucion);
            const devolucionGuardada = await queryRunner.manager.save(Devoluciones, devolucion);
            for (const item of dto.detalles) {
                const detalleDevolucion = new DevolucionDetalles();
                detalleDevolucion.devolucionId = devolucionGuardada.id;
                detalleDevolucion.productoId = item.productoId;
                detalleDevolucion.cantidadDevuelta = item.cantidad;
                console.log('Guardando detalle de devolución:', detalleDevolucion);
                await queryRunner.manager.save(DevolucionDetalles, detalleDevolucion);
            }
            console.log('Devolución y detalles guardados con éxito');
            await queryRunner.commitTransaction();
            return CustomUtils.responseApi('Devolución registrada con éxito');
        }catch(error){
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }   

    async getTotalDevolucionesPorClienteHoy(clienteId: number) {
        const result = await this.devolucionesRepo
            .createQueryBuilder("devoluciones")
            .select("SUM(devoluciones.cantidad)", "total")
            .where("devoluciones.clienteId = :clienteId and devoluciones.updated_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)", { clienteId })
            .getRawOne();   
        return result.total || 0;
    }
}