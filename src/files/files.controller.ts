import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
  BadRequestException // <--- Importante: Agregamos esto para lanzar errores manuales
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Mantenemos solo la validación de tamaño (5MB) aquí
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), 
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // --- VALIDACIÓN MANUAL (A prueba de fallos) ---
    // Verificamos si el mimetype empieza con "image/"
    if (!file.mimetype.match(/^image\//)) {
        throw new BadRequestException(`Tipo de archivo no válido: ${file.mimetype}. Solo se permiten imágenes.`);
    }

    return this.filesService.uploadImage(file);
  }
}