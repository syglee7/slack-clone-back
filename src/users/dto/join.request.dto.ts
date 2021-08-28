import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'syglee7@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  public nickname: string;

  public password: string;
}
