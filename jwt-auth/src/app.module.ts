import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtController } from './controllers/jwt.controller';
import {HealthController} from './controllers/health.controller';

const JWT_SECRET = process.env.JWT_SECRET || 'changeit';

@Module({
  imports: [JwtModule.register({ secret: JWT_SECRET })],
  controllers: [JwtController, HealthController],
  providers: [],
})
export class AppModule {}
