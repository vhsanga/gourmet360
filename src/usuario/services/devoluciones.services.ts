import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Devoluciones } from "src/entities/entities/Devoluciones";
import { Repository } from "typeorm";

@Injectable()
export class DevolucionesService {
    constructor(
        @InjectRepository(Devoluciones)       private readonly devolucionesRepo: Repository<Devoluciones>
    ) {}
    
    async guardarDevolucion(cantidad: number, clienteId: number, ChofetId:number) {
        console.log('cantidad:'+cantidad);
        console.log('clienteId:'+clienteId);
        console.log('ChofetId:'+ChofetId);
        const devolucion = new Devoluciones();
        devolucion.cantidad = cantidad;
        devolucion.clienteId = clienteId;
        devolucion.choferId = ChofetId;
        devolucion.fechaDevolucion = new Date();
        return await this.devolucionesRepo.save(devolucion);
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