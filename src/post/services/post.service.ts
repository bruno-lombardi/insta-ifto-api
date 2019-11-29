import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { PaginateService } from '../../common/services/paginate.service';
import { ImageCompressorService } from './image-compressor.service';
import { PaginatePostDto } from '../dto/paginate-post.dto';

@Injectable()
export class PostService {
  imageProcessingError = 'Ocorreu um erro ao processar a imagem do seu post, tente novamente.';

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly paginateService: PaginateService,
    private readonly imageCompressor: ImageCompressorService,
  ) { }

  async createPost(createDto: CreatePostDto, image: Express.Multer.File) {
    try {
      const result = await this.imageCompressor.compressImage(image);
      createDto.image = result.image;
      createDto.imageSmall = result.imageSmall;
      createDto.aspectRatio = result.aspectRatio;
    } catch (err) {
      throw new
        HttpException({ error: { message: this.imageProcessingError, code: HttpStatus.UNPROCESSABLE_ENTITY } }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const post = this.postRepository.create(createDto);
    return this.postRepository.save(post);
  }

  async findPost(id: string) {
    return await this.findPostBy({ where: { id }, relations: ['author'] });
  }

  async findPostBy(options: FindOneOptions<Post>) {
    const post = await this.postRepository.findOne(options);
    if (!post) {
      throw new HttpException({ error: { message: 'Este post não foi encontrado.', code: HttpStatus.NOT_FOUND } }, HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async paginatePosts(paginateDto: PaginatePostDto) {
    if (!paginateDto.page || paginateDto.page < 1) {
      paginateDto.page = 1;
    }
    const query = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC');

    query
      .skip((paginateDto.page - 1) * paginateDto.limit)
      .take(paginateDto.limit);
    const result = await query.getManyAndCount();

    return this.paginateService.paginate<Post>(
      result[0],
      result[1],
      paginateDto.page,
      paginateDto.limit,
    );
  }

  async deletePost(id: string) {
    return await this.postRepository.delete(id);
  }
}
