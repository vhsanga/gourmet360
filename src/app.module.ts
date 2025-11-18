import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuarios } from './entities/entities/Usuarios';
import { Clientes } from './entities/entities/Clientes';
import { Categorias } from './entities/entities/Categorias';
import { Productos } from './entities/entities/Productos';
import { Camiones } from './entities/entities/Camiones';
import { Rutas } from './entities/entities/Rutas';
import { RutaClientes } from './entities/entities/RutaClientes';
import { Despachos } from './entities/entities/Despachos';
import { DespachoDetalles } from './entities/entities/DespachoDetalles';
import { Ventas } from './entities/entities/Ventas';
import { VentaDetalles } from './entities/entities/VentaDetalles';
import { Cobros } from './entities/entities/Cobros';
import { Rendiciones } from './entities/entities/Rendiciones';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { Devoluciones } from './entities/entities/Devoluciones';
import { DevolucionDetalles } from './entities/entities/DevolucionDetalles';
import { Cambios } from './entities/entities/Cambios';
import { CambioDetalles } from './entities/entities/CambioDetalles';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'remoto',
      password: 'P@ss4930',
      database: 'gourmet360',
      entities: [Usuarios, Clientes, Categorias, Productos, Camiones, Rutas, RutaClientes, Despachos, DespachoDetalles, Ventas, VentaDetalles, Cobros, Rendiciones, Devoluciones, DevolucionDetalles, Cambios, CambioDetalles,  ],
      //synchronize: true, // ⚠️ Solo en desarrollo
    }),
    UsuarioModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}