import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ImageCompressorService } from './services/image-compressor.service';
import { ConfigModule } from '../config/config.module';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CommonModule, ConfigModule, TypeOrmModule.forFeature([Post]), AuthModule],
  controllers: [PostController],
  providers: [PostService, ImageCompressorService],
})
export class PostModule {}
