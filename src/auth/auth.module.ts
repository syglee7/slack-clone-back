import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';

@Module({
  // 남의 모듈
  imports: [
    PassportModule.register({ session: true }), // 세션 기반일떄. jwt 같은 토큰 기반 쓸 때 false 하면 session에 저장되지 않음
    TypeOrmModule.forFeature([Users]),
  ],

  // Injectable 붙으면 provider
  providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
