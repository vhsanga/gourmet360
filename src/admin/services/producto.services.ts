import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Productos } from "src/entities/entities/Productos";
import { Repository } from "typeorm";
import { CreateProductoDto } from "../dtos/create-producto.dto";


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

    async crearProducto(dto: CreateProductoDto): Promise<Productos> {
        const producto = new Productos();
        producto.idCategoria = dto.idCategoria;
        producto.nombre = dto.nombre;
        producto.precioUnitario = dto.precioUnitario.toString();
        if (dto.precioUnitarioMin !== undefined) {
            producto.precioUnitarioMin = dto.precioUnitarioMin.toString();
        }
        if (dto.costoUnitario !== undefined) {
            producto.costoUnitario = dto.costoUnitario.toString();
        }
        producto.activo = true;
        producto.fechaRegistro = new Date();
        producto.createdAt = new Date();
        producto.updatedAt = new Date();
        return await this.productoRepository.save(producto);
    }
}