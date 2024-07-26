import { Configuration } from 'src/config/configuration';
import { User } from 'src/user/entities/user.entity';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Configuration, true>,
    private readonly jwtService: JwtService,
  ) {}

  async generateJWT(user: User): Promise<string> {
    const { id, email, role } = user;
    const { secret, accessTokenLifetime } = this.configService.get('auth', {
      infer: true,
    });
    const payload = { id, email, role };
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: accessTokenLifetime,
    });
  }
}
