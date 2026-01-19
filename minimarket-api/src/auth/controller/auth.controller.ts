import { Controller, Post, Body, Get, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() body: { id: number; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(
      body.id,
      body.password,
    );

    res.cookie('access_token', access_token, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: 'Sesión iniciada' };
  }

  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refresh_token = req.cookies['refresh_token'];
    if (!refresh_token)
      throw new UnauthorizedException('Refresh token no encontrado');

    const { access_token } =
      await this.authService.refreshAccessToken(refresh_token);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return { message: 'Access token renovado' };
  }

  @Get('user-by-token')
  async getUserByToken(@Req() req: Request) {
    const token = req.cookies['access_token'];
    if (!token) throw new UnauthorizedException('Token no encontrado');

    return await this.authService.getUserByToken(token);
  }
}
