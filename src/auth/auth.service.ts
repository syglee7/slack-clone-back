import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  //constructor(private usersService: UsersService) {}
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async validateUser(email: string, password: string) {
    // const user = await this.usersService.findByEmail(email);
    // 서비스 안에 서비스를 둘 수도 있지만 점점 더 복잡해 질 수 있으므로
    // controller 안에서는 service 만, 서비스 안에서는 repository 만, Repository 안에는 entity 만 쓰는 식이 좋음!

    const user = await this.usersRepository.findOne({
      where: { email },
    });
    console.log(email, password, user);

    if (!user) {
      return null;
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      // user 에서 password 만 빼고 싶을 때 -> password, 나머지
      // delete user.password;
      return userWithoutPassword;
    }

    return null;
  }
}
