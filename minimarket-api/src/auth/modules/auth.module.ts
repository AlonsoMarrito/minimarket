import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { PrismaService } from '../../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../estrategy/jwt.strategy';
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        const privateKeyPath =
          process.env.JWT_PRIVATE_KEY_PATH ||
          path.join('/certs', 'jwtRS256.key');
        const publicKeyPath =
          process.env.JWT_PUBLIC_KEY_PATH ||
          path.join('/certs', 'jwtRS256.key.pub');

        const privateKey = existsSync(privateKeyPath)
          ? readFileSync(privateKeyPath, 'utf8')
          : undefined;
        const publicKey = existsSync(publicKeyPath)
          ? readFileSync(publicKeyPath, 'utf8')
          : undefined;

        if (!privateKey || !publicKey) {
          console.error(
            `Archivo de llave pública/privada JWT no encontrado en: ${privateKeyPath} / ${publicKeyPath}`,
          );
        }

        return {
          privateKey,
          publicKey,
          signOptions: { algorithm: 'RS256', expiresIn: '15m' },
        };
      },
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtModule, AuthService],
})
export class AuthModule {}
