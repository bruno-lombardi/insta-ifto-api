import { IPaginateRequest } from '../../common/interfaces/i-paginate-request.interface';
import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginatePostDto implements IPaginateRequest {
  @IsNumber()
  @Type(() => Number)
  @Transform(value => Number(value), { toClassOnly: true })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @Transform(value => Number(value), { toClassOnly: true })
  page: number = 1;
}
