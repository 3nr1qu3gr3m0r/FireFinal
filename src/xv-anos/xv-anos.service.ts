import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XvContract } from './entities/xv-contract.entity';
import { XvConcept } from './entities/xv-concept.entity';
import { XvPayment } from './entities/xv-payment.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { AddConceptDto } from './dto/add-concept.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { UpdateContractDto } from './dto/update-contract.dto'; // Asegúrate de tener este import

@Injectable()
export class XvAnosService {
  private readonly MAX_MONEY = 99999999.99;
  private readonly MIN_MONEY = 0.01;

  constructor(
    @InjectRepository(XvContract) private contractRepo: Repository<XvContract>,
    @InjectRepository(XvConcept) private conceptRepo: Repository<XvConcept>,
    @InjectRepository(XvPayment) private paymentRepo: Repository<XvPayment>,
  ) {}

  // Utilidad para validar dinero
  private validateAndRoundMoney(amount: number, label: string, allowZero = false): number {
    let num = Number(amount);
    if (isNaN(num)) throw new BadRequestException(`${label} debe ser un número válido.`);
    num = Math.round((num + Number.EPSILON) * 100) / 100;

    if (num < (allowZero ? 0 : this.MIN_MONEY)) {
      throw new BadRequestException(`${label} no puede ser menor a ${allowZero ? 0 : this.MIN_MONEY}.`);
    }
    if (num > this.MAX_MONEY) {
      throw new BadRequestException(`${label} excede el límite permitido.`);
    }
    return num;
  }

  async create(createDto: CreateContractDto) {
    const total = this.validateAndRoundMoney(createDto.contractTotal, "El costo del paquete");
    const contract = this.contractRepo.create({
      studentName: createDto.studentName,
      eventDate: createDto.date, 
      contractTotal: total,
    });
    return this.contractRepo.save(contract);
  }

  async findAll() { 
      return this.contractRepo.find({ order: { createdAt: 'DESC' } }); 
  }

  async findOne(id: string, relations: string[] = []) {
    // Si relations viene vacío, cargamos por defecto concepts y payments gracias a eager: true en la entidad
    const contract = await this.contractRepo.findOne({ 
        where: { id }, 
        relations: relations.length > 0 ? relations : ['concepts', 'payments']
    });
    
    if (!contract) throw new NotFoundException('Contrato no encontrado');
    return contract;
  }

  async update(id: string, updateDto: UpdateContractDto) {
    const contract = await this.findOne(id);
    if (updateDto.date) contract.eventDate = new Date(updateDto.date);
    if (updateDto.contractTotal !== undefined) contract.contractTotal = this.validateAndRoundMoney(updateDto.contractTotal, "Nuevo Total");
    if (updateDto.studentName) contract.studentName = updateDto.studentName;
    return this.contractRepo.save(contract);
  }

  async remove(id: string) {
    const contract = await this.findOne(id);
    await this.contractRepo.remove(contract);
    return { message: 'Contrato eliminado correctamente' };
  }

  // --- AGREGAR CONCEPTO ---
  async addConcept(contractId: string, dto: AddConceptDto) {
    // 1. Buscamos el contrato
    const contract = await this.findOne(contractId);
    
    // 2. Validamos montos
    const realCost = this.validateAndRoundMoney(dto.realCost, "El costo real", true);
    const clientCost = this.validateAndRoundMoney(dto.clientCost, "El precio cliente", true);

    if (realCost === 0 && clientCost === 0) {
        throw new BadRequestException("El concepto debe tener valor.");
    }

    // 3. Validamos presupuesto
    const contractTotal = Number(contract.contractTotal);
    const currentAllocated = contract.concepts ? contract.concepts.reduce((sum, c) => sum + Number(c.clientCost), 0) : 0;
    const availableBudget = Math.round((contractTotal - currentAllocated) * 100) / 100;

    if (clientCost > availableBudget) {
        throw new BadRequestException(`Solo quedan $${availableBudget} disponibles en el contrato.`);
    }

    // 4. Creamos y guardamos el concepto
    const concept = this.conceptRepo.create({
      name: dto.name,
      realCost: realCost,
      clientCost: clientCost,
      paid: 0,
      contract: contract, // Asignamos la relación explícitamente
    });
    
    await this.conceptRepo.save(concept);

    // 5. Retornamos el contrato actualizado para que el frontend lo vea de inmediato
    return this.findOne(contractId);
  }

  // --- AGREGAR PAGO ---
  async addPayment(contractId: string, dto: AddPaymentDto) {
    const contract = await this.findOne(contractId);
    
    const amountToPay = this.validateAndRoundMoney(dto.amount, "El abono");
    const paymentDate = new Date(dto.date);
    
    // Validar fecha contra creación
    const contractCreationDate = contract.createdAt ? new Date(contract.createdAt) : new Date();
    contractCreationDate.setHours(0,0,0,0);
    if (paymentDate < contractCreationDate) {
         // Opcional: permitir fechas pasadas si es migración de datos, si no, descomentar:
         // throw new BadRequestException("La fecha es anterior al contrato.");
    }

    // Validar deuda global
    const totalPaidGlobal = contract.concepts ? contract.concepts.reduce((sum, c) => sum + Number(c.paid), 0) : 0;
    const contractTotal = Number(contract.contractTotal);
    const globalRemaining = Math.round((contractTotal - totalPaidGlobal) * 100) / 100;

    if (amountToPay > globalRemaining) {
        throw new BadRequestException(`El abono ($${amountToPay}) excede la deuda ($${globalRemaining}).`);
    }

    let conceptNameRecord = "General";

    if (dto.conceptId === 'general') {
      let remaining = amountToPay;
      // Usamos los conceptos cargados
      const conceptsToPay = contract.concepts || []; 

      for (const concept of conceptsToPay) {
        const clientCost = Number(concept.clientCost);
        const paid = Number(concept.paid);
        
        if (remaining > 0 && paid < clientCost) {
          const debt = Math.round((clientCost - paid) * 100) / 100;
          const toPay = Math.min(debt, remaining);
          
          concept.paid = Number(concept.paid) + toPay;
          remaining = Math.round((remaining - toPay) * 100) / 100;
          
          await this.conceptRepo.save(concept);
        }
      }
    } else {
      const targetConcept = contract.concepts.find(c => String(c.id) === String(dto.conceptId));
      if (!targetConcept) throw new NotFoundException("Concepto no encontrado.");
      
      const specificDebt = Math.round((Number(targetConcept.clientCost) - Number(targetConcept.paid)) * 100) / 100;
      if (amountToPay > specificDebt) {
        throw new BadRequestException(`El abono supera la deuda del concepto.`);
      }
      
      targetConcept.paid = Number(targetConcept.paid) + amountToPay;
      conceptNameRecord = targetConcept.name;
      await this.conceptRepo.save(targetConcept);
    }

    const payment = this.paymentRepo.create({
      amount: amountToPay,
      date: dto.date,
      conceptName: conceptNameRecord,
      contract: contract,
    });
    
    await this.paymentRepo.save(payment);

    return this.findOne(contractId);
  }
}