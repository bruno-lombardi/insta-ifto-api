import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Por favor informe um email válido!' })
  email: string;

  @Length(6, 64, {
    message:
      'Informe uma senha que contenha entre $constraint1 e $constraint2 caracteres.',
  })
  password: string;

  @IsString()
  @Length(2, 128, {
    message:
      'Informe um nome que contenha entre $constraint1 e $constraint2 caracteres.',
  })
  firstName: string;

  @IsString()
  @Length(2, 128, {
    message:
      'Informe um sobrenome que contenha entre $constraint1 e $constraint2 caracteres.',
  })
  lastName: string;
}
