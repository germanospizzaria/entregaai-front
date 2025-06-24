import type { Stop } from "../../driver/types/stop";

export type Order = {
  id: number;
  crmPedidoId: string;
  enderecoCompleto: string;
  nomeCliente: string;
  latitude: number;
  longitude: number;
  tempoMaximoEntrega: string;
  statusGeral: StatusPedido;
  paradas: Stop[];
  createdAt: string;
  updatedAt: string;
};

export const StatusPedido = {
  AGUARDANDO_ROTA: "AGUARDANDO_ROTA",
  EM_ROTA: "EM_ROTA",
  CONCLUIDO: "CONCLUIDO",
} as const;

export type StatusPedido = (typeof StatusPedido)[keyof typeof StatusPedido];
