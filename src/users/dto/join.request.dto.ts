import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

// 클래스간에 중복 제거
export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
