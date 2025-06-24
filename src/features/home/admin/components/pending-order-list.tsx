import type React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { Order } from "../types/order";
import { StatusPedido as StatusPedidoEnum } from "../types/order";

interface PendingOrdersListProps {
  orders: Order[];
  selectedOrders: number[];
  onOrderSelect: (orderId: number, checked: boolean) => void;
  onViewAllOrders?: () => void;
  loading: boolean;
}

export const PendingOrdersList: React.FC<PendingOrdersListProps> = ({
  orders,
  selectedOrders,
  onOrderSelect,
  onViewAllOrders,
  loading,
}) => {
  const pendingOrders = orders.filter(
    (order) => order.statusGeral === StatusPedidoEnum.AGUARDANDO_ROTA
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 px-4">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral-200 rounded-full animate-pulse" />
          <div className="h-5 sm:h-6 bg-neutral-200 rounded w-24 sm:w-32 animate-pulse" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3 sm:p-4 bg-neutral-50 rounded-lg animate-pulse"
            >
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 h-full flex flex-col">
      {onViewAllOrders && (
        <button
          onClick={onViewAllOrders}
          className="flex w-1/2 items-center py-1.5 sm:py-2 mb-2 text-xs sm:text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors hover:border-neutral-300 "
        >
          <span className="hidden sm:inline">Ver Todos</span>
          <span className="sm:hidden">Todos</span>
        </button>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-italian-red/10 rounded-full flex items-center justify-center">
            <ClockCircleOutlined className="text-italian-red text-xs sm:text-sm" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-neutral-800">
              Pedidos Pendentes
            </h2>
            <p className="text-sm text-neutral-500 hidden sm:block">
              Para despacho
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-italian-red/10 text-italian-red text-xs font-medium px-2 py-1 rounded-full">
            {pendingOrders.length}{" "}
            {pendingOrders.length === 1 ? "pedido" : "pedidos"}
          </span>
          {selectedOrders.length > 0 && (
            <span className="bg-italian-green/10 text-italian-green text-xs font-medium px-2 py-1 rounded-full">
              {selectedOrders.length} selecionados
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 sm:space-y-3">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleOutlined className="text-green-500 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-green-700 mb-2">
                Tudo em dia! 🎉
              </h3>
              <p className="text-sm text-green-600 mb-4">
                Não há pedidos aguardando despacho
              </p>
              {onViewAllOrders && (
                <button
                  onClick={onViewAllOrders}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
                >
                  <EyeOutlined />
                  Ver todos os pedidos
                </button>
              )}
            </div>
          ) : (
            pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrders.includes(order.id)}
                onSelect={(checked) => onOrderSelect(order.id, checked)}
              />
            ))
          )}
        </div>
      </div>

      {pendingOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">
              {selectedOrders.length > 0
                ? `${selectedOrders.length} de ${pendingOrders.length} selecionados`
                : `${pendingOrders.length} aguardando despacho`}
            </span>
            {onViewAllOrders && (
              <button
                onClick={onViewAllOrders}
                className="text-italian-green hover:text-italian-green/80 font-medium transition-colors"
              >
                Ver histórico →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderCard: React.FC<{
  order: Order;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}> = ({ order, isSelected, onSelect }) => {
  return (
    <div
      className={`p-3 sm:p-4 rounded-lg border transition-all cursor-pointer hover:shadow-soft ${
        isSelected
          ? "border-italian-red bg-italian-red/5 shadow-soft"
          : "border-neutral-200 bg-neutral-50 hover:bg-white hover:border-italian-red/30"
      }`}
      onClick={() => onSelect(!isSelected)}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
            isSelected
              ? "border-italian-red bg-italian-red"
              : "border-neutral-300"
          }`}
        >
          {isSelected && <CheckCircleOutlined className="text-white text-xs" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-neutral-800 text-sm truncate">
              {order.nomeCliente}
            </span>
            <span className="bg-italian-red/10 text-italian-red text-xs font-medium px-2 py-1 rounded flex-shrink-0">
              Pendente
            </span>
          </div>

          <div className="text-neutral-600 text-xs mb-2 break-words leading-relaxed">
            {order.enderecoCompleto}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>#{order.crmPedidoId}</span>
            <span>
              {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {order.tempoMaximoEntrega && (
            <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
              <div className="flex items-center gap-1 text-orange-600 text-xs">
                <ClockCircleOutlined />
                <span className="font-medium">
                  Entregar até:{" "}
                  {new Date(order.tempoMaximoEntrega).toLocaleTimeString(
                    "pt-BR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
