import type { Order } from "../../admin/types/order";
import type { Run } from "../../driver/types/run";
import type { Driver } from "../../driver/types/driver";
import { StatusPedido } from "../../admin/types/order";
import { StatusCorrida } from "../../driver/types/run";
import { StatusEntregador } from "../../driver/types/driver";
import { StatusParada } from "../../driver/types/stop";

// --- MOCK DRIVERS ---
export const mockDrivers: Driver[] = [
  {
    id: 1,
    nome: "João Silva",
    telefone: "(11) 98765-4321",
    status: StatusEntregador.ATIVO,
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    telefone: "(11) 91234-5678",
    status: StatusEntregador.ATIVO,
  },
  {
    id: 3,
    nome: "Carlos Pereira",
    telefone: "(11) 95555-8888",
    status: StatusEntregador.INATIVO,
  },
];

export const mockAvailableDeliveryPersons: Driver[] = mockDrivers.filter(
  (d) => d.status === "ativo"
);

// --- MOCK ORDERS (for active runs) ---
const orderForRun1Stop1: Order = {
  id: 101,
  crmPedidoId: "CRM-101",
  enderecoCompleto: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
  latitude: -23.5613,
  longitude: -46.6565,
  tempoMaximoEntrega: "2025-06-18T20:30:00Z",
  statusGeral: StatusPedido.EM_ROTA,
  paradas: [],
  createdAt: "2025-06-18T19:45:00Z",
  updatedAt: "2025-06-18T20:05:00Z",
};

const orderForRun1Stop2: Order = {
  id: 102,
  crmPedidoId: "CRM-102",
  enderecoCompleto: "R. Augusta, 2077 - Cerqueira César, São Paulo - SP",
  latitude: -23.557,
  longitude: -46.663,
  tempoMaximoEntrega: "2025-06-18T20:45:00Z",
  statusGeral: StatusPedido.EM_ROTA,
  paradas: [],
  createdAt: "2025-06-18T19:50:00Z",
  updatedAt: "2025-06-18T19:50:00Z",
};

const orderForRun2Stop1: Order = {
  id: 201,
  crmPedidoId: "CRM-201",
  enderecoCompleto: "R. Oscar Freire, 974 - Jardins, São Paulo - SP",
  latitude: -23.5595,
  longitude: -46.668,
  tempoMaximoEntrega: "2025-06-18T21:00:00Z",
  statusGeral: StatusPedido.EM_ROTA,
  paradas: [],
  createdAt: "2025-06-18T20:10:00Z",
  updatedAt: "2025-06-18T20:25:00Z",
};

const orderForRun2Stop2: Order = {
  id: 202,
  crmPedidoId: "CRM-202",
  enderecoCompleto: "Al. Santos, 2157 - Cerqueira César, São Paulo - SP",
  latitude: -23.558,
  longitude: -46.661,
  tempoMaximoEntrega: "2025-06-18T21:15:00Z",
  statusGeral: StatusPedido.EM_ROTA,
  paradas: [],
  createdAt: "2025-06-18T20:12:00Z",
  updatedAt: "2025-06-18T20:40:00Z",
};

// --- MOCK PENDING ORDERS ---
export const mockPendingOrders: Order[] = [
  {
    id: 1,
    crmPedidoId: "CRM-001",
    enderecoCompleto: "Rua Haddock Lobo, 595 - Cerqueira César, São Paulo - SP",
    latitude: -23.558,
    longitude: -46.669,
    tempoMaximoEntrega: "2025-06-18T21:00:00Z",
    statusGeral: StatusPedido.AGUARDANDO_ROTA,
    paradas: [],
    createdAt: "2025-06-18T20:00:00Z",
    updatedAt: "2025-06-18T20:00:00Z",
  },
  {
    id: 2,
    crmPedidoId: "CRM-002",
    enderecoCompleto:
      "Av. Brigadeiro Faria Lima, 2232 - Jardim Paulistano, São Paulo - SP",
    latitude: -23.5779,
    longitude: -46.685,
    tempoMaximoEntrega: "2025-06-18T21:15:00Z",
    statusGeral: StatusPedido.AGUARDANDO_ROTA,
    paradas: [],
    createdAt: "2025-06-18T20:05:00Z",
    updatedAt: "2025-06-18T20:05:00Z",
  },
  {
    id: 3,
    crmPedidoId: "CRM-003",
    enderecoCompleto: "R. dos Pinheiros, 1275 - Pinheiros, São Paulo - SP",
    latitude: -23.565,
    longitude: -46.691,
    tempoMaximoEntrega: "2025-06-18T21:30:00Z",
    statusGeral: StatusPedido.AGUARDANDO_ROTA,
    paradas: [],
    createdAt: "2025-06-18T20:10:00Z",
    updatedAt: "2025-06-18T20:10:00Z",
  },
];

// --- MOCK ACTIVE RUNS ---
export const mockActiveRuns: Run[] = [
  {
    id: 1,
    status: StatusCorrida.EM_ANDAMENTO,
    entregadorId: 1,
    entregador: mockDrivers.find((d) => d.id === 1),
    paradas: [
      {
        id: 1,
        ordem: 1,
        status: StatusParada.CONCLUIDA,
        horarioConclusao: "2025-06-18T20:05:00Z",
        corridaId: 1,
        pedidoId: 101,
        pedido: orderForRun1Stop1,
        createdAt: "2025-06-18T19:55:00Z",
        updatedAt: "2025-06-18T20:05:00Z",
      },
      {
        id: 2,
        ordem: 2,
        status: StatusParada.PENDENTE,
        corridaId: 1,
        pedidoId: 102,
        pedido: orderForRun1Stop2,
        createdAt: "2025-06-18T19:55:00Z",
        updatedAt: "2025-06-18T19:55:00Z",
      },
    ],
    createdAt: "2025-06-18T19:55:00Z",
    updatedAt: "2025-06-18T19:55:00Z",
  },
  {
    id: 2,
    status: StatusCorrida.EM_ANDAMENTO,
    entregadorId: 2,
    entregador: mockDrivers.find((d) => d.id === 2),
    paradas: [
      {
        id: 3,
        ordem: 1,
        status: StatusParada.CONCLUIDA,
        horarioConclusao: "2025-06-18T20:25:00Z",
        corridaId: 2,
        pedidoId: 201,
        pedido: orderForRun2Stop1,
        createdAt: "2025-06-18T20:15:00Z",
        updatedAt: "2025-06-18T20:25:00Z",
      },
      {
        id: 4,
        ordem: 2,
        status: StatusParada.PENDENTE,
        corridaId: 2,
        pedidoId: 202,
        pedido: orderForRun2Stop2,
        createdAt: "2025-06-18T20:15:00Z",
        updatedAt: "2025-06-18T20:15:00Z",
      },
    ],
    createdAt: "2025-06-18T20:15:00Z",
    updatedAt: "2025-06-18T20:15:00Z",
  },
];

const order1: Order = {
  id: 101,
  crmPedidoId: "CRM-101",
  enderecoCompleto: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
  latitude: -23.5613,
  longitude: -46.6565,
  tempoMaximoEntrega: "2025-06-18T20:30:00Z",
  statusGeral: StatusPedido.EM_ROTA,
  paradas: [],
  createdAt: "2025-06-18T19:45:00Z",
  updatedAt: "2025-06-18T20:05:00Z",
};

const order2: Order = {
  id: 102,
  crmPedidoId: "CRM-102",
  enderecoCompleto: "R. Augusta, 2077 - Cerqueira César, São Paulo - SP",
  latitude: -23.557,
  longitude: -46.663,
  tempoMaximoEntrega: "2025-06-18T20:45:00Z",
  statusGeral: StatusPedido.EM_ROTA,
  paradas: [],
  createdAt: "2025-06-18T19:50:00Z",
  updatedAt: "2025-06-18T19:50:00Z",
};

const order3: Order = {
  id: 103,
  crmPedidoId: "CRM-103",
  enderecoCompleto: "R. da Consolação, 3000 - Jardins, São Paulo - SP",
  latitude: -23.555,
  longitude: -46.662,
  tempoMaximoEntrega: "2025-06-18T21:00:00Z",
  statusGeral: StatusPedido.EM_ROTA,
  paradas: [],
  createdAt: "2025-06-18T19:52:00Z",
  updatedAt: "2025-06-18T19:52:00Z",
};

export const mockDriver: Driver = {
  id: 1,
  nome: "João Silva",
  telefone: "(11) 98765-4321",
  status: StatusEntregador.ATIVO,
  corridas: [
    {
      id: 1,
      status: StatusCorrida.EM_ANDAMENTO,
      entregadorId: 1,
      paradas: [
        {
          id: 1,
          ordem: 1,
          status: StatusParada.CONCLUIDA,
          horarioConclusao: "2025-06-18T20:05:00Z",
          corridaId: 1,
          pedidoId: 101,
          pedido: order1,
          createdAt: "2025-06-18T19:55:00Z",
          updatedAt: "2025-06-18T20:05:00Z",
        },
        {
          id: 2,
          ordem: 2,
          status: StatusParada.PENDENTE,
          corridaId: 1,
          pedidoId: 102,
          pedido: order2,
          createdAt: "2025-06-18T19:55:00Z",
          updatedAt: "2025-06-18T19:55:00Z",
        },
        {
          id: 3,
          ordem: 3,
          status: StatusParada.PENDENTE,
          corridaId: 1,
          pedidoId: 103,
          pedido: order3,
          createdAt: "2025-06-18T19:55:00Z",
          updatedAt: "2025-06-18T19:55:00Z",
        },
      ],
      createdAt: "2025-06-18T19:55:00Z",
      updatedAt: "2025-06-18T19:55:00Z",
    },
  ],
};
