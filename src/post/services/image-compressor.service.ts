import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';
import { ConfigService } from '../../config/services/config.service';

@Injectable()
export class ImageCompressorService {

  s3: AWS.S3;

  constructor(
    private readonly configService: ConfigService,
  ) {
    if (this.configService.get('UPLOAD_METHOD') === 's3') {
      AWS.config.update({
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      });
      this.s3 = new AWS.S3();
    }
  }

  async compressImage(image: Express.Multer.File) {
    const meta = await sharp(image.path).metadata();
    const aspectRatio = meta.width / meta.height;
    const [mainUpload, smallUpload] = await this.uploadImage(image);

    return {
      image: mainUpload.Location,
      imageSmall: smallUpload.Location,
      aspectRatio,
    };
  }

  async uploadImage(image: Express.Multer.File): Promise<AWS.S3.ManagedUpload.SendData[]> {
    const buffer = await sharp(image.path)
      .resize(1080, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(image.mimetype.split('/')[1])
      .toBuffer();

    const bufferSmall = await sharp(image.path)
      .resize(60, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(image.mimetype.split('/')[1])
      .toBuffer();

    const mainUpload = this.uploadToS3(buffer, 'ifto-instagram', `posts/${image.filename}`, image.mimetype);
    const smallUpload = this.uploadToS3(bufferSmall, 'ifto-instagram', `posts/small-${image.filename}`, image.mimetype);

    fs.unlink(image.path, (err) => {
      Logger.error(err);
    });

    return await Promise.all([mainUpload, smallUpload]);
  }

  private async uploadToLocal(image: Express.Multer.File) {
    const resizedPath = path.resolve(image.destination, `resized-${image.filename}`);
    await sharp(image.path)
      .resize(1080, null, {
        fit: 'inside',
      })
      .toFormat(image.mimetype.split('/')[1])
      .toFile(resizedPath);

    fs.unlink(image.path, (err) => {
      Logger.error(err);
    });
    return resizedPath;
  }

  private uploadToS3(buffer: Buffer, bucket: string, filename: string, mimetype: string): Promise<AWS.S3.ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      this.s3.upload({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
        ACL: 'public-read',
        ContentType: mimetype,
      }, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
