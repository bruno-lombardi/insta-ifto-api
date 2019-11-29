import { IsString, IsOptional, MaxLength } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(1024, { message: 'A legenda do post deve possuir no máximo $constraint1 caracteres.' })
  content: string;
  aspectRatio: number;
  image: string;
  imageSmall?: string;
  author?: User;
}
