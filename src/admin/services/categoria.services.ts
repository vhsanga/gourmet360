import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Productos } from "src/entities/entities/Productos";
import { Repository } from "typeorm";
import { CreateProductoDto } from "../dtos/create-producto.dto";
import { Categorias } from "src/entities/entities/Categorias";


@Injectable()
export class CategoriaServices{
    constructor(
        @InjectRepository(Categorias) private repo: Repository<Categorias>,
    ){}

    async listarCategorias(){
        return await this.repo.find({
            select: ['id', 'nombre'],
            where: { activo: true }, order: { id: 'ASC' } 
        });
    }

    async crearCategoria(nombre: string): Promise<Categorias> {
        const categoria = new Categorias();
        categoria.nombre = nombre;
        categoria.activo = true;
        categoria.fechaRegistro = new Date();
        categoria.createdAt = new Date();
        categoria.updatedAt = new Date();
       return await this.repo.save(categoria);
    }
}