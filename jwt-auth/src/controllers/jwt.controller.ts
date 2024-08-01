import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, Payload } from 'src/models';

const AUTHORIZATION = 'Authorization';
const BEARER = 'Bearer ';

@Controller('jwt')
export class JwtController {
  constructor(private readonly jwtSvc: JwtService) {}

  @Post('sign')
  @HttpCode(200)
  sign(@Body() payload: Payload): Promise<string> {
    return this.jwtSvc.signAsync(payload);
  }

  @Post('validate')
  @HttpCode(200)
  validate(@Headers(AUTHORIZATION) authHeader: string = ''): AuthResponse {
    if (!(authHeader && authHeader.startsWith(BEARER)))
      throw new UnauthorizedException();

    const token = authHeader.substring(BEARER.length);

    const payload = this.jwtSvc.decode(token);
    if (!payload) throw new ForbiddenException();

    return { timestamp: new Date().getTime() } as AuthResponse;
  }
}
