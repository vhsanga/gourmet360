import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'src/usuario/services/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { CustomUtils } from 'src/utils/custom_utils';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(celular: string, password: string): Promise<any> {
    const user = await this.usuariosService.findOneByCelular(celular);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.pin);
    if (!isMatch) throw new UnauthorizedException('Pin incorrect');

    const { pin: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.celular, sub: user.id, rol: user.rol };
    return CustomUtils.responseApi('Login exitoso', {
      user,
      access_token: this.jwtService.sign(payload),
    });
  }

  async register(registerDto: RegisterDto) {
    const { nombre, celular, pin, rol } = registerDto;

    const existing = await this.usuariosService.findOneByCelular(celular);
    if (existing) {
      throw new ConflictException('El celular ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(pin, 10);

    const newUser = await this.usuariosService.create({
      nombre,
      celular,
      pin: hashedPassword,
      rol: rol || 'vendedor',
      activo: true,
      created_by: null,
      updated_by: null,
    });

    // Devolvemos el usuario sin el campo password
    const { pin: _, ...result } = newUser;
    return CustomUtils.responseApi('Usuario registrado exitosamente', result);
  }
}
