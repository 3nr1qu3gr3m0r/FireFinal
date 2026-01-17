import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { XvAnosService } from './xv-anos.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { AddConceptDto } from './dto/add-concept.dto';
import { AddPaymentDto } from './dto/add-payment.dto';

@Controller('xv-anos')
export class XvAnosController {
  constructor(private readonly xvService: XvAnosService) {}

  @Post()
  create(@Body() createDto: CreateContractDto) {
    return this.xvService.create(createDto);
  }

  @Get()
  findAll() {
    return this.xvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.xvService.findOne(id);
  }

  @Post(':id/concepts')
  addConcept(@Param('id') id: string, @Body() dto: AddConceptDto) {
    return this.xvService.addConcept(id, dto);
  }

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() dto: AddPaymentDto) {
    return this.xvService.addPayment(id, dto);
  }
}