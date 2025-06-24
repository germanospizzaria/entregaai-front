import type { StatusPedido } from "../../admin/types/order";
import type { Run } from "./run";

export type Stop = {
  id: number;
  ordem: number;
  status: StatusParada;
  horarioConclusao?: string;
  corridaId: number;
  corrida?: Run;
  pedidoId: number;
  pedido: {
    id: number;
    crmPedidoId: string;
    enderecoCompleto: string;
    latitude: number;
    longitude: number;
    tempoMaximoEntrega: string;
    nomeCliente: string;
    statusGeral: StatusPedido;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const StatusParada = {
  PENDENTE: "PENDENTE",
  CONCLUIDA: "CONCLUIDA",
} as const;

export type StatusParada = (typeof StatusParada)[keyof typeof StatusParada];
