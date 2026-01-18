import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  async uploadImage(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    if (!file) throw new BadRequestException('No se proporcionó ningún archivo');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'fire-inside' },
        (error, result) => {
          if (error) return reject(error);
          // CORRECCIÓN: Validar explícitamente que result exista
          if (!result) return reject(new Error('Error en Cloudinary: No se recibió respuesta'));

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }
}