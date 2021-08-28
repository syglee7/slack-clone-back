import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { User } from '../common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';

// 전체 컨트롤러에서 return 되는 모든 값에 적용 된다
@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USERS')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({
    description: '성공!',
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버에러',
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }
  /*  getUsers(@Req() req) {
    return req.user;
    // res.locals.jwt
  }*/

  @ApiOperation({ summary: '회원가입' })
  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    this.usersService.postUsers(data.email, data.nickname, data.password);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    // @Req() req
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
