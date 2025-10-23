import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Const } from 'src/utils/const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'skudhfsoigjsdofijgsdfg8sdgfjksdfks',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, rol: payload.rol };
  }
}
