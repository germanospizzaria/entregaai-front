import type { Driver } from "./driver";
import type { Stop } from "./stop";

export type Run = {
  id: number;
  status: StatusCorrida;
  entregadorId: number;
  entregador?: Driver;
  paradas: Stop[];
  createdAt: string;
  updatedAt: string;
};

export const StatusCorrida = {
  EM_ANDAMENTO: "EM_ANDAMENTO",
  FINALIZADA: "FINALIZADA",
  CANCELADA: "CANCELADA",
} as const;

export type StatusCorrida = (typeof StatusCorrida)[keyof typeof StatusCorrida];
