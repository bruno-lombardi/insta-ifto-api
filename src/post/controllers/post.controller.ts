import { Controller, Post as PostMethod, Body, Logger, UseInterceptors, UploadedFile, Param, Get, ParseUUIDPipe, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { diskStorage } from 'multer';
import { ImageCompressorService } from '../services/image-compressor.service';
import { PaginatePostDto } from '../dto/paginate-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserREST } from '../../auth/decorators/current-user-rest.decorator';
import { User } from '../../user/entities/user.entity';

@Controller('api/v1/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly imageCompressor: ImageCompressorService,
  ) { }

  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 5242880, // 5MB
    },
    storage: diskStorage({
      filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
      destination(req, file, cb) {
        cb(null, process.env.NODE_ENV !== 'production' ? '/tmp' : path.resolve(__dirname, '../../uploads'));
      },
    }),
    fileFilter: (req, file, cb) => {
      const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(acceptedFormat => acceptedFormat === file.mimetype);
      if (isAccepted) {
        return cb(null, true);
      }
      return cb(null, false);
    },
  }))
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard())
  @PostMethod()
  async createPost(@Body() createDto: CreatePostDto, @UploadedFile() image: Express.Multer.File, @CurrentUserREST() author: User) {
    createDto.author = author;
    const post = await this.postService.createPost(createDto, image);
    return { post };
  }

  @Get(':id')
  async getPost(@Param('id', ParseUUIDPipe) id: string) {
    const post = await this.postService.findPost(id);
    return { post };
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async paginatePosts(@Query() paginateDto: PaginatePostDto) {
    return await this.postService.paginatePosts(paginateDto);
  }
}
