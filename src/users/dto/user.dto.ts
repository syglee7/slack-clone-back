import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from './join.request.dto';

// runtime 에도 존재하기 때문에 validation 라이브러리를 붙여서
// body 받음과 동시에 validate 를 할 수 있다
export class UserDto extends JoinRequestDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: '아이디',
  })
  id: number;
}
