import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private privateKey: string;
  private publicKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.privateKey = fs.readFileSync(
      process.env.JWT_PRIVATE_KEY_PATH ||
        path.join(__dirname, '../../../certs/jwtRS256.key'),
      'utf8',
    );

    this.publicKey = fs.readFileSync(
      process.env.JWT_PUBLIC_KEY_PATH ||
        path.join(__dirname, '../../../certs/jwtRS256.key.pub'),
      'utf8',
    );
  }

  // 🔐 LOGIN
  async login(id: number, password: string) {
    const user = await this.prisma.employeed.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('Empleado no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: user.id,
      type: user.type,
    };

    const access_token = this.jwtService.sign(payload, {
      privateKey: this.privateKey,
      algorithm: 'RS256',
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      privateKey: this.privateKey,
      algorithm: 'RS256',
      expiresIn: '24h',
    });

    return { access_token, refresh_token };
  }

  // 🔍 USUARIO DESDE TOKEN
  async getUserByToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        publicKey: this.publicKey,
        algorithms: ['RS256'],
      });

      const user = await this.prisma.employeed.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Empleado no encontrado');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(
        'Token inválido o expirado',
      );
    }
  }

  // ♻️ REFRESH TOKEN
  async refreshAccessToken(refresh_token: string) {
    try {
      const decoded = this.jwtService.verify(refresh_token, {
        publicKey: this.publicKey,
        algorithms: ['RS256'],
      });

      const payload = {
        sub: decoded.sub,
        type: decoded.type,
      };

      const access_token = this.jwtService.sign(payload, {
        privateKey: this.privateKey,
        algorithm: 'RS256',
        expiresIn: '15m',
      });

      return { access_token };
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token inválido o expirado',
      );
    }
  }
}
