import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'celular' }); // 👈 campo que se usará como "usuario"
  }

  async validate(celular: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(celular, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
