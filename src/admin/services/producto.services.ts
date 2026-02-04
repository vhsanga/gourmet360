import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Productos } from "src/entities/entities/Productos";
import { Repository } from "typeorm";


@Injectable()
export class ProductoServices{
    constructor(
        @InjectRepository(Productos) private productoRepository: Repository<Productos>,
    ){}

    async listarProductos(){
        return await this.productoRepository
            .createQueryBuilder('productos')
            .innerJoinAndSelect('categorias', 'c', 'c.id = productos.id_categoria', { activo: 1 })
            .select([
            'productos.id  as id',
            'productos.nombre as nombre',
            'productos.unidad as unidad ',
            'productos.precio_unitario as precio_unitario',
            'productos.precio_unitario_min as precio_unitario_min',
            'productos.costo_unitario as costo_unitario',
            'c.id as categoria_id',
            'c.nombre as categoria_nombre',
            ])
            .orderBy('productos.id', 'ASC')
            .getRawMany();
    }


}