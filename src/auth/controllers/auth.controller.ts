import { Controller, Post, Body, UsePipes, ValidationPipe, HttpStatus, HttpCode, HttpException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return {user};
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const [token, user] = await this.authService.signIn(signInDto.email, signInDto.password);
    if (token && user) {
      return {token, user};
    } else {
      throw new HttpException(
        { error: 'Email ou senha incorretos.', code: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
