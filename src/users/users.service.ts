import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    // DI를 해줘야 나중에 Repository 만 바꾸면 실DB에 쿼리 안날리고 테스트나 가짜에 날릴 수 있음
    // DI 할 때 실제 객체는 module 에 넣어줘야 함
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  getUser() {}

  async join(email: string, nickname: string, password: string) {
    if (!email) {
      // 이메일 없다고 에러
      // throw new Error('이메일 없음');
      // throw new HttpException('이메일 없음', 400);
    }
    if (!nickname) {
      // 닉네임 없다고 에러
      //throw new Error('닉네임 없음');
      //throw new HttpException('닉네임 없음', 400);
      // throw new BadRequestException('닉네임 없음');
    }
    if (!password) {
      // 비밀번호 없다고 에러
      //throw new Error('비밀번호 없음');
      //throw new HttpException('비밀번호 없음', 401);
      //  new UnauthorizedException('비밀번호 없음');
    }

    // -- 이 모든걸 자동으로 체크 할 수는 없을까? -> DTO단에서 가능함! --

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      // 이미 존재하는 유저라고 에러
      //throw new Error('이미 존재하는 사용자 입니다.');
      throw new HttpException('이미 존재하는 사용자 입니다.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
