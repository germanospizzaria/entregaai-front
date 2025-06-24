import type { Run } from "./run";

export type Driver = {
  id: number;
  nome: string;
  telefone: string;
  status: StatusEntregador;
  corridas?: Run[];
};

export const StatusEntregador = {
  ATIVO: "ATIVO",
  INATIVO: "INATIVO",
};
export type StatusEntregador =
  (typeof StatusEntregador)[keyof typeof StatusEntregador];

export type CreateDeliveryDriverDto = {
  nome: string;
  telefone: string;
};
