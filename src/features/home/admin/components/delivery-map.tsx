/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Order } from "../types/order";
import { StatusPedido } from "../types/order";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Ícone customizado para a pizzaria
const pizzariaIcon = new L.DivIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, rgb(34, 139, 34), rgb(220, 38, 38));
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 3px solid white;
      font-size: 20px;
    ">
      🍕
    </div>
  `,
  className: "custom-pizzaria-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Função para criar ícone de pedido pendente com número
const createPendingOrderIcon = (orderNumber: string) =>
  new L.DivIcon({
    html: `
    <div style="
      background: rgb(220, 38, 38);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(220, 38, 38, 0.3);
      border: 2px solid white;
      color: white;
      font-weight: bold;
      animation: pulse 2s infinite;
      cursor: pointer;
      position: relative;
    ">
      <div style="font-size: 10px; line-height: 1;">📦</div>
      <div style="font-size: 14px; line-height: 1; margin-top: 1px;">#${orderNumber}</div>
    </div>
  `,
    className: "custom-pending-order-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

// Função para criar ícone de pedido em rota com número
const createInRouteOrderIcon = (orderNumber: string) =>
  new L.DivIcon({
    html: `
    <div style="
      background: rgb(59, 130, 246);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
      border: 2px solid white;
      color: white;
      font-weight: bold;
      cursor: not-allowed;
      opacity: 0.8;
    ">
      <div style="font-size: 10px; line-height: 1;">🚚</div>
      <div style="font-size: 14px; line-height: 1; margin-top: 1px;">#${orderNumber}</div>
    </div>
  `,
    className: "custom-inroute-order-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

// Função para criar ícone de pedido concluído com número
const createCompletedOrderIcon = (orderNumber: string) =>
  new L.DivIcon({
    html: `
    <div style="
      background: rgb(34, 197, 94);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(34, 197, 94, 0.3);
      border: 2px solid white;
      color: white;
      font-weight: bold;
      cursor: not-allowed;
      opacity: 0.7;
    ">
      <div style="font-size: 10px; line-height: 1;">✅</div>
      <div style="font-size: 14px; line-height: 1; margin-top: 1px;">#${orderNumber}</div>
    </div>
  `,
    className: "custom-completed-order-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

// Função para criar ícone de pedido selecionado com número
const createSelectedOrderIcon = (orderNumber: string) =>
  new L.DivIcon({
    html: `
    <div style="
      background: rgb(34, 139, 34);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(34, 139, 34, 0.4);
      border: 3px solid white;
      color: white;
      font-weight: bold;
      animation: bounce 1s infinite;
    ">
      <div style="font-size: 11px; line-height: 1;">✓</div>
      <div style="font-size: 14px; line-height: 1; margin-top: 1px;">#${orderNumber}</div>
    </div>
  `,
    className: "custom-selected-order-icon",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

interface DeliveryMapProps {
  pizzariaLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  orders?: Order[];
  selectedOrders?: number[];
  onOrderSelect?: (orderId: number, checked?: boolean) => void;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  pizzariaLocation,
  orders = [],
  selectedOrders = [],
  onOrderSelect,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    pizzariaLocation.lat,
    pizzariaLocation.lng,
  ]);

  // Mapeamento de status para ícones
  const getOrderIcon = (order: Order, isSelected: boolean) => {
    const canBeSelected = order.statusGeral === StatusPedido.AGUARDANDO_ROTA;

    // Extrair o número do pedido do CRM (pegar os últimos 4 dígitos para melhor visualização)
    const orderNumber = order.crmPedidoId.slice(-4);

    if (isSelected && canBeSelected) {
      return createSelectedOrderIcon(orderNumber);
    }

    switch (order.statusGeral) {
      case StatusPedido.AGUARDANDO_ROTA:
        return createPendingOrderIcon(orderNumber);
      case StatusPedido.EM_ROTA:
        return createInRouteOrderIcon(orderNumber);
      case StatusPedido.CONCLUIDO:
        return createCompletedOrderIcon(orderNumber);
      default:
        return createPendingOrderIcon(orderNumber);
    }
  };

  useEffect(() => {
    if (orders.length > 0) {
      // Calculate the average latitude and longitude of all orders
      let sumLat = 0;
      let sumLng = 0;
      let validOrderCount = 0;

      orders.forEach((order) => {
        if (order.latitude && order.longitude) {
          sumLat += order.latitude;
          sumLng += order.longitude;
          validOrderCount++;
        }
      });

      if (validOrderCount > 0) {
        const avgLat = sumLat / validOrderCount;
        const avgLng = sumLng / validOrderCount;
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, [orders]);

  const ordersWithCoordinates = orders.filter(
    (order) =>
      order.latitude &&
      order.longitude &&
      order.latitude !== 0 &&
      order.longitude !== 0
  );

  const handleOrderClick = (order: Order) => {
    // Só permite seleção de pedidos aguardando rota
    if (order.statusGeral === StatusPedido.AGUARDANDO_ROTA && onOrderSelect) {
      onOrderSelect(order.id);
    }
  };

  function FlyTo({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center, 13, {
        animate: true,
        duration: 1,
      });
    }, [map, center]);
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-3 sm:p-6 h-full relative z-10">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-italian-green/10 rounded-full flex items-center justify-center">
            <EnvironmentOutlined className="text-italian-green text-xs" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-neutral-800">
            Mapa de Entregas
          </h2>
        </div>

        {ordersWithCoordinates.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-600">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-italian-red rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm">
                {
                  ordersWithCoordinates.filter(
                    (o) => o.statusGeral === StatusPedido.AGUARDANDO_ROTA
                  ).length
                }{" "}
                pendentes
              </span>
            </div>
            {ordersWithCoordinates.filter(
              (o) => o.statusGeral === StatusPedido.EM_ROTA
            ).length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full" />
                <span className="text-xs sm:text-sm">
                  {
                    ordersWithCoordinates.filter(
                      (o) => o.statusGeral === StatusPedido.EM_ROTA
                    ).length
                  }{" "}
                  em rota
                </span>
              </div>
            )}
            {ordersWithCoordinates.filter(
              (o) => o.statusGeral === StatusPedido.CONCLUIDO
            ).length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                <span className="text-xs sm:text-sm">
                  {
                    ordersWithCoordinates.filter(
                      (o) => o.statusGeral === StatusPedido.CONCLUIDO
                    ).length
                  }{" "}
                  concluídos
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="h-[calc(100%-2.5rem)] rounded-lg overflow-hidden border border-neutral-200 relative"
        style={{ zIndex: 1 }}
      >
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo center={mapCenter} />

          <Marker
            position={[pizzariaLocation.lat, pizzariaLocation.lng]}
            icon={pizzariaIcon}
          >
            <Popup className="custom-popup">
              <div className="text-center p-2">
                <div className="font-semibold text-neutral-800 text-lg mb-2">
                  🍕 Germano's Pizzaria
                </div>
                <div className="text-neutral-600 text-sm">
                  {pizzariaLocation.address}
                </div>
                <div className="mt-2 px-3 py-1 bg-italian-green/10 text-italian-green text-xs font-medium rounded-full inline-block">
                  Base de Operações
                </div>
              </div>
            </Popup>
          </Marker>

          {ordersWithCoordinates.map((order) => {
            const isSelected = selectedOrders.includes(order.id);
            const canBeSelected =
              order.statusGeral === StatusPedido.AGUARDANDO_ROTA;

            return (
              <Marker
                key={order.id}
                position={[order.latitude!, order.longitude!]}
                icon={getOrderIcon(order, isSelected)}
                eventHandlers={{
                  click: () => handleOrderClick(order),
                }}
              >
                <Popup
                  className="custom-popup"
                  maxWidth={window.innerWidth < 768 ? 260 : 300}
                  closeButton={true}
                  autoClose={false}
                  closeOnEscapeKey={true}
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            order.statusGeral === StatusPedido.AGUARDANDO_ROTA
                              ? "bg-italian-red/10"
                              : order.statusGeral === StatusPedido.EM_ROTA
                              ? "bg-blue-100"
                              : "bg-green-100"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              order.statusGeral === StatusPedido.AGUARDANDO_ROTA
                                ? "text-italian-red"
                                : order.statusGeral === StatusPedido.EM_ROTA
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {order.statusGeral === StatusPedido.AGUARDANDO_ROTA
                              ? "📦"
                              : order.statusGeral === StatusPedido.EM_ROTA
                              ? "🚚"
                              : "✅"}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-800 text-sm truncate">
                            Pedido #{order.crmPedidoId.slice(0, 6)}...
                          </div>
                          <div className="text-xs text-neutral-500 truncate">
                            ID: {order.id}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-2 mb-2 rounded-full text-xs font-medium ${
                        isSelected && canBeSelected
                          ? "bg-italian-green/10 text-italian-green"
                          : order.statusGeral === StatusPedido.AGUARDANDO_ROTA
                          ? "bg-italian-red/10 text-italian-red"
                          : order.statusGeral === StatusPedido.EM_ROTA
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isSelected && canBeSelected
                        ? "Selecionado"
                        : order.statusGeral === StatusPedido.AGUARDANDO_ROTA
                        ? "Aguardando Despacho"
                        : order.statusGeral === StatusPedido.EM_ROTA
                        ? "Em Rota"
                        : "Concluído"}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <UserOutlined className="text-neutral-400 text-xs mt-1 flex-shrink-0" />
                        <div className="text-sm min-w-0 flex-1">
                          <div className="font-medium text-neutral-700">
                            Cliente
                          </div>
                          <div className="text-neutral-600">
                            {order.nomeCliente || "Nome não informado"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <EnvironmentOutlined className="text-neutral-400 text-xs mt-1 flex-shrink-0" />
                        <div className="text-sm min-w-0 flex-1">
                          <div className="font-medium text-neutral-700">
                            Endereço
                          </div>
                          <div className="text-neutral-600 break-words">
                            {order.enderecoCompleto}
                          </div>
                        </div>
                      </div>

                      {order.tempoMaximoEntrega && (
                        <div className="flex items-start gap-2">
                          <ClockCircleOutlined className="text-orange-500 text-xs mt-1 flex-shrink-0" />
                          <div className="text-sm min-w-0 flex-1">
                            <div className="font-medium text-neutral-700">
                              Entregar até
                            </div>
                            <div className="text-orange-600 font-medium">
                              {new Date(
                                order.tempoMaximoEntrega
                              ).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {onOrderSelect && (
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        {canBeSelected ? (
                          <button
                            onClick={() => handleOrderClick(order)}
                            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              isSelected
                                ? "bg-italian-green text-white hover:bg-italian-green/90"
                                : "bg-italian-red text-white hover:bg-italian-red/90"
                            }`}
                          >
                            {isSelected ? "✓ Selecionado" : "Selecionar Pedido"}
                          </button>
                        ) : (
                          <div className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-500 text-center">
                            {order.statusGeral === StatusPedido.EM_ROTA
                              ? "🚚 Pedido já está em rota"
                              : "✅ Pedido já foi concluído"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {ordersWithCoordinates.length > 0 && (
        <div className="hidden sm:block absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-medium border border-neutral-200 text-xs z-10">
          <div className="font-medium text-neutral-700 mb-2">Legenda</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-italian-red rounded-full flex items-center justify-center text-white text-xs">
                📦
              </div>
              <span className="text-neutral-600">Aguardando despacho</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-italian-green rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
              <span className="text-neutral-600">Selecionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                🚚
              </div>
              <span className="text-neutral-600">Em rota</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                ✅
              </div>
              <span className="text-neutral-600">Concluído</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
