import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../common/services/crypto.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../user/entities/user.entity';
import { IAuthService } from '../interfaces/i-auth-service.interface';
import { SignUpDto } from '../dto/sign-up.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) { }

  async signIn(email: string, password: string): Promise<[string, User]> {
    const user = await this.usersService.findUserBy({ where: { email } });
    if (!user) {
      throw new HttpException(
        { error: 'Email ou senha incorretos.', code: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const passMatch: boolean = await this.cryptoService.compareHash(
      password,
      user.password,
    );
    if (passMatch) {
      const payload: JwtPayload = { email: user.email, id: user.id };
      const token = await this.createToken(payload);
      user.password = undefined;
      return [token, user];
    }
    return [null, null];
  }

  async signUp(signUpDto: SignUpDto) {
    let user = await this.usersService.findUserBy({ where: { email: signUpDto.email } });
    if (user) {
      throw new HttpException({
        error: 'Um usuário com este email já existe.',
        code: HttpStatus.CONFLICT,
      }, HttpStatus.CONFLICT);
    } else {
      user = await this.usersService.createUser(signUpDto);
      user.password = undefined;
      return user;
    }
  }

  async createToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    Logger.log('Payload: ' + JSON.stringify(payload));
    return this.usersService.findUserBy({
      where: { ...payload },
      relations: ['roles'],
    });
  }
}
