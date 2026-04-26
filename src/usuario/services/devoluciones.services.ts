import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Devoluciones } from "src/entities/entities/Devoluciones";
import { DataSource, Repository } from "typeorm";
import { CreateDevolucionDto } from "../dto/create-devolucion.dto";
import { DevolucionDetalles } from "src/entities/entities/DevolucionDetalles";
import { CustomUtils } from "src/utils/custom_utils";
import { DespachoDetalles } from "src/entities/entities/DespachoDetalles";

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
            await this.devolucionesRepo.save(devolucion);
            const devolucionGuardada = await queryRunner.manager.save(Devoluciones, devolucion);
            for (const item of dto.detalles) {
                const despachoDetalle = await queryRunner.manager.findOne(
                    DespachoDetalles,
                    {
                    where: {
                        despachoId: dto.despachoId,
                        productoId: item.productoId,
                    },
                    },
                );
                
                if (!despachoDetalle) {
                    throw new NotFoundException(
                    `El producto ${item.productoId} no está en el despacho.`,
                    );
                }
        
                if ((despachoDetalle.cantidadRestante ?? 0) < item.cantidad) {
                    throw new BadRequestException(
                    `Stock insuficiente del producto ${item.productoId}. Disponible: ${despachoDetalle.cantidadRestante ?? 0}`,
                    );
                }
        
                // 4.1 — Descontar stock
                despachoDetalle.cantidadRestante = (despachoDetalle.cantidadRestante ?? 0) - item.cantidad;
                despachoDetalle.cantidadEntregada =  Number(despachoDetalle.cantidadEntregada ?? 0) + Number(item.cantidad);
                await queryRunner.manager.save(DespachoDetalles, despachoDetalle);
                        
                const detalleDevolucion = new DevolucionDetalles();
                detalleDevolucion.devolucionId = devolucionGuardada.id;
                detalleDevolucion.productoId = item.productoId;
                detalleDevolucion.cantidadDevuelta = item.cantidad;
                await queryRunner.manager.save(DevolucionDetalles, detalleDevolucion);
            }
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