import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Importar
import { XvAnosService } from './xv-anos.service';
import { XvAnosController } from './xv-anos.controller';

// 👇 IMPORTAR LAS 3 ENTIDADES
import { XvContract } from './entities/xv-contract.entity';
import { XvConcept } from './entities/xv-concept.entity';
import { XvPayment } from './entities/xv-payment.entity';

@Module({
  imports: [
    // 👇 ESTO ES LO QUE HACE QUE SE CREEN LAS TABLAS EN LA BD
    TypeOrmModule.forFeature([XvContract, XvConcept, XvPayment]), 
  ],
  controllers: [XvAnosController],
  providers: [XvAnosService],
})
export class XvAnosModule {}