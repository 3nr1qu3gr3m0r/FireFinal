// src/types/xv-anos.ts

export interface XvConcept {
  id: number;
  name: string;
  realCost: number;
  clientCost: number;
  paid: number;
}

export interface XvPayment {
  id: number;
  amount: number;
  date: string;
  conceptName: string;
}

export interface XvContract {
  id: string;
  studentName: string;
  eventDate: string;
  contractTotal: number;
  concepts: XvConcept[];
  payments: XvPayment[];
  createdAt: string; // 👈 ESTO ES CRUCIAL PARA LA VALIDACIÓN DE FECHA
}