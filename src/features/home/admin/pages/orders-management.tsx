/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Input, Select, DatePicker } from "antd";
import type { Order } from "../types/order";
import { StatusPedido as StatusPedidoEnum } from "../types/order";
import { useDeliveryData } from "../hooks/use-delivery-data";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OrdersManagementPageProps {
  onBack: () => void;
}

export const OrdersManagementPage: React.FC<OrdersManagementPageProps> = ({
  onBack,
}) => {
  const { pendingOrders, loading } = useDeliveryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const allOrders = pendingOrders;
  const pendingOrdersList = allOrders.filter(
    (order) => order.statusGeral === StatusPedidoEnum.AGUARDANDO_ROTA
  );
  const inRouteOrders = allOrders.filter(
    (order) => order.statusGeral === StatusPedidoEnum.EM_ROTA
  );
  const completedOrders = allOrders.filter(
    (order) => order.statusGeral === StatusPedidoEnum.CONCLUIDO
  );

  const getFilteredOrders = (orders: Order[]) => {
    return orders.filter((order) => {
      const matchesSearch =
        order.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.enderecoCompleto
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.crmPedidoId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.statusGeral === statusFilter;

      const matchesDate =
        !dateRange ||
        (new Date(order.createdAt) >= dateRange[0]?.toDate() &&
          new Date(order.createdAt) <= dateRange[1]?.toDate());

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filteredPending = getFilteredOrders(pendingOrdersList);
  const filteredInRoute = getFilteredOrders(inRouteOrders);
  const filteredCompleted = getFilteredOrders(completedOrders);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-neutral-200 rounded w-1/3" />
              <div className="h-12 bg-neutral-200 rounded" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-neutral-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeftOutlined className="text-neutral-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-neutral-800">
                Gerenciamento de Pedidos
              </h1>
              <p className="text-neutral-500 text-sm">
                Visualize e gerencie todos os pedidos do sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FilterOutlined className="text-neutral-600" />
            <h2 className="font-semibold text-neutral-800">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Buscar
              </label>
              <Input
                placeholder="Cliente, endereço ou ID do pedido"
                prefix={<SearchOutlined className="text-neutral-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
                placeholder="Todos os status"
              >
                <Option value="all">Todos os status</Option>
                <Option value={StatusPedidoEnum.AGUARDANDO_ROTA}>
                  Aguardando Despacho
                </Option>
                <Option value={StatusPedidoEnum.EM_ROTA}>Em Rota</Option>
                <Option value={StatusPedidoEnum.CONCLUIDO}>Concluído</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Período
              </label>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                className="w-full"
                placeholder={["Data inicial", "Data final"]}
                format="DD/MM/YYYY"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-italian-red/5 rounded-lg p-3">
                <div className="text-italian-red font-bold text-lg">
                  {filteredPending.length}
                </div>
                <div className="text-italian-red text-xs">Pendentes</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-blue-600 font-bold text-lg">
                  {filteredInRoute.length}
                </div>
                <div className="text-blue-600 text-xs">Em Rota</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-green-600 font-bold text-lg">
                  {filteredCompleted.length}
                </div>
                <div className="text-green-600 text-xs">Concluídos</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OrderSection
            title="Pedidos Aguardando Despacho"
            icon={<ClockCircleOutlined className="text-italian-red" />}
            orders={filteredPending}
            variant="pending"
            emptyMessage="Nenhum pedido aguardando despacho"
          />

          <OrderSection
            title="Pedidos Em Rota"
            icon={<CarOutlined className="text-blue-600" />}
            orders={filteredInRoute}
            variant="in-route"
            emptyMessage="Nenhum pedido em rota"
          />

          <OrderSection
            title="Pedidos Concluídos"
            icon={<CheckCircleOutlined className="text-green-600" />}
            orders={filteredCompleted}
            variant="completed"
            emptyMessage="Nenhum pedido concluído"
          />
        </div>
      </div>
    </div>
  );
};

const OrderSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  orders: Order[];
  variant: "pending" | "in-route" | "completed";
  emptyMessage: string;
}> = ({ title, icon, orders, variant, emptyMessage }) => {
  const [expanded, setExpanded] = useState(variant === "pending");

  const getVariantStyles = () => {
    switch (variant) {
      case "pending":
        return {
          header: "bg-italian-red/5 border-italian-red/20",
          card: "border-italian-red/20 bg-italian-red/5",
          status: "bg-italian-red/10 text-italian-red",
        };
      case "in-route":
        return {
          header: "bg-blue-50 border-blue-200",
          card: "border-blue-200 bg-blue-50/50",
          status: "bg-blue-100 text-blue-700",
        };
      case "completed":
        return {
          header: "bg-green-50 border-green-200",
          card: "border-green-200 bg-green-50/50",
          status: "bg-green-100 text-green-700",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden">
      <div
        className={`p-4 sm:p-6 border-b cursor-pointer ${styles.header}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">{title}</h3>
              <p className="text-sm text-neutral-600">
                {orders.length} pedidos
              </p>
            </div>
          </div>
          <div className="text-neutral-400">{expanded ? "−" : "+"}</div>
        </div>
      </div>

      {expanded && (
        <div className="p-4 sm:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {icon}
              </div>
              <p className="text-neutral-500">{emptyMessage}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {orders.map((order) => (
                <DetailedOrderCard
                  key={order.id}
                  order={order}
                  variant={variant}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Card detalhado para cada pedido
const DetailedOrderCard: React.FC<{
  order: Order;
  variant: "pending" | "in-route" | "completed";
}> = ({ order, variant }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "pending":
        return {
          border: "border-italian-red/20 bg-italian-red/5",
          status: "bg-italian-red/10 text-italian-red",
        };
      case "in-route":
        return {
          border: "border-blue-200 bg-blue-50/50",
          status: "bg-blue-100 text-blue-700",
        };
      case "completed":
        return {
          border: "border-green-200 bg-green-50/50",
          status: "bg-green-100 text-green-700",
        };
    }
  };

  const styles = getVariantStyles();
  const statusText = {
    [StatusPedidoEnum.AGUARDANDO_ROTA]: "Aguardando",
    [StatusPedidoEnum.EM_ROTA]: "Em Rota",
    [StatusPedidoEnum.CONCLUIDO]: "Concluído",
  };

  return (
    <div className={`p-4 rounded-lg border ${styles.border}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-neutral-800">
          {order.nomeCliente}
        </span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${styles.status}`}
        >
          {statusText[order.statusGeral]}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <EnvironmentOutlined className="text-neutral-400 mt-0.5 flex-shrink-0" />
          <span className="text-neutral-600 break-words">
            {order.enderecoCompleto}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <UserOutlined className="text-neutral-400" />
          <span className="text-neutral-600">#{order.crmPedidoId}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-neutral-400" />
          <span className="text-neutral-600">
            {new Date(order.createdAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
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
                {new Date(order.tempoMaximoEntrega).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
