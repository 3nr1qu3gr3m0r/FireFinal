import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XvContract } from './entities/xv-contract.entity';
import { XvConcept } from './entities/xv-concept.entity';
import { XvPayment } from './entities/xv-payment.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { AddConceptDto } from './dto/add-concept.dto';
import { AddPaymentDto } from './dto/add-payment.dto';

@Injectable()
export class XvAnosService {
  private readonly MAX_MONEY = 99999999.99;
  private readonly MIN_MONEY = 0.01;

  constructor(
    @InjectRepository(XvContract) private contractRepo: Repository<XvContract>,
    @InjectRepository(XvConcept) private conceptRepo: Repository<XvConcept>,
    @InjectRepository(XvPayment) private paymentRepo: Repository<XvPayment>,
  ) {}

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

  // --- 1. CREAR CONTRATO ---
  async create(createDto: CreateContractDto) {
    const eventDate = new Date(createDto.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) throw new BadRequestException("La fecha del evento no puede ser en el pasado.");

    const total = this.validateAndRoundMoney(createDto.contractTotal, "El costo del paquete");

    const contract = this.contractRepo.create({
      studentName: createDto.studentName,
      eventDate: createDto.date, 
      contractTotal: total,
    });
    return this.contractRepo.save(contract);
  }

  // --- 2. AGREGAR CONCEPTO ---
  async addConcept(contractId: string, dto: AddConceptDto) {
    const contract = await this.findOne(contractId, ['concepts']);
    
    const realCost = this.validateAndRoundMoney(dto.realCost, "El costo real", true);
    const clientCost = this.validateAndRoundMoney(dto.clientCost, "El precio cliente", true);

    if (realCost === 0 && clientCost === 0) {
        throw new BadRequestException("El concepto debe tener valor (gasto o venta).");
    }

    const contractTotal = Number(contract.contractTotal);
    const currentAllocated = contract.concepts.reduce((sum, c) => sum + Number(c.clientCost), 0);
    const availableBudget = Math.round((contractTotal - currentAllocated) * 100) / 100;

    if (clientCost > availableBudget) {
        throw new BadRequestException(`Solo quedan $${availableBudget} disponibles en el contrato.`);
    }

    const concept = this.conceptRepo.create({
      name: dto.name,
      realCost: realCost,
      clientCost: clientCost,
      paid: 0,
      contract,
    });
    
    return this.conceptRepo.save(concept);
  }

  // --- 3. AGREGAR PAGO ---
  async addPayment(contractId: string, dto: AddPaymentDto) {
    const contract = await this.findOne(contractId, ['concepts']);
    
    const amountToPay = this.validateAndRoundMoney(dto.amount, "El abono");
    const paymentDate = new Date(dto.date);
    const contractCreationDate = new Date(contract.createdAt);
    contractCreationDate.setHours(0,0,0,0); 

    if (paymentDate < contractCreationDate) {
        throw new BadRequestException("La fecha es anterior a la creación del contrato.");
    }

    const totalPaidGlobal = contract.concepts.reduce((sum, c) => sum + Number(c.paid), 0);
    const contractTotal = Number(contract.contractTotal);
    const globalRemaining = Math.round((contractTotal - totalPaidGlobal) * 100) / 100;

    if (amountToPay > globalRemaining) {
        throw new BadRequestException(`El abono ($${amountToPay}) excede la deuda ($${globalRemaining}).`);
    }

    let conceptNameRecord = "General";

    if (dto.conceptId === 'general') {
      let remaining = amountToPay;
      // Ordenamos para priorizar (si los IDs son numéricos sirve, si son UUID no afecta mucho el sort simple)
      const conceptsToPay = contract.concepts; 

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
      // 🔥 CORRECCIÓN: Comparación segura de IDs (String vs String)
      const targetConcept = contract.concepts.find(c => String(c.id) === String(dto.conceptId));
      
      if (!targetConcept) throw new NotFoundException("Concepto no encontrado en este contrato.");
      
      const specificDebt = Math.round((Number(targetConcept.clientCost) - Number(targetConcept.paid)) * 100) / 100;
      
      if (amountToPay > specificDebt) {
        throw new BadRequestException(`El abono supera la deuda del concepto ($${specificDebt}).`);
      }
      
      targetConcept.paid = Number(targetConcept.paid) + amountToPay;
      conceptNameRecord = targetConcept.name;
      await this.conceptRepo.save(targetConcept);
    }

    const payment = this.paymentRepo.create({
      amount: amountToPay,
      date: dto.date,
      conceptName: conceptNameRecord,
      contract,
    });
    await this.paymentRepo.save(payment);

    return this.findOne(contractId, ['concepts', 'payments']);
  }

  async findAll() { 
      return this.contractRepo.find({ order: { createdAt: 'DESC' } }); 
  }

  // 🔥 CORRECCIÓN CRÍTICA: Quitamos Number(id)
  async findOne(id: string, relations: string[] = []) {
    const contract = await this.contractRepo.findOne({ 
        where: { id }, // Pasamos el string directo como pide la entidad
        relations 
    });
    
    if (!contract) throw new NotFoundException('Contrato no encontrado');
    return contract;
  }
}