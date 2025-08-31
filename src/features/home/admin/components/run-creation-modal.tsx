"use client";

import type React from "react";
import { Modal, Button } from "antd";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CarOutlined,
  DashOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { Run } from "../../driver/types/run";

interface RunCreatedModalProps {
  visible: boolean;
  onClose: () => void;
  runData: Run | null;
  routeDetails?: {
    totalDistance: number;
    totalDuration: string;
    optimizedSequence: number[];
  } | null;
}

export const RunCreatedModal: React.FC<RunCreatedModalProps> = ({
  visible,
  onClose,
  runData,
  routeDetails,
}) => {
  if (!runData) return null;

  const sortedStops = runData.paradas.sort((a, b) => a.ordem - b.ordem);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{
        maxWidth: "100vw",
        margin: 0,
        top: 0,
        paddingBottom: 0,
      }}
      styles={{
        body: { padding: 0 },
        content: {
          margin: "8px",
          maxWidth: "calc(100vw - 16px)",
          maxHeight: "calc(100vh - 16px)",
          borderRadius: "12px",
        },
      }}
      className="run-created-modal-responsive"
      closeIcon={
        <CloseOutlined className="text-neutral-500 hover:text-neutral-700 text-lg" />
      }
      centered
      destroyOnClose
    >
      <div className="max-h-[calc(100vh-32px)] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleOutlined className="text-green-600 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-2">
              Corrida Criada com Sucesso!
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto">
              A rota foi otimizada para máxima eficiência
            </p>
          </div>

          <div className="bg-gradient-to-r from-italian-green/5 to-italian-red/5 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-italian-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CarOutlined className="text-italian-green text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-500 mb-1">Corrida</p>
                  <p className="font-bold text-neutral-800 text-lg truncate">
                    #{runData.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-italian-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserOutlined className="text-italian-red text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-500 mb-1">Entregador</p>
                  <p className="font-bold text-neutral-800 text-lg truncate">
                    {runData.entregador?.nome || runData.entregadorId}
                  </p>
                </div>
              </div>

              {routeDetails && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <DashOutlined className="text-blue-600 text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-neutral-500 mb-1">
                        Distância Total
                      </p>
                      <p className="font-bold text-neutral-800 text-lg">
                        {(routeDetails.totalDistance / 1000).toFixed(1)} km
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ClockCircleOutlined className="text-orange-600 text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-neutral-500 mb-1">
                        Tempo Estimado
                      </p>
                      <p className="font-bold text-neutral-800 text-lg">
                        {routeDetails.totalDuration} min
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <DashOutlined className="text-italian-green text-xl" />
              <h3 className="text-lg sm:text-xl font-bold text-neutral-800">
                Sequência de Entregas
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-italian-green/5 rounded-xl border border-italian-green/20">
                <div className="w-10 h-10 bg-italian-green rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  🍕
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-800">
                    Germano's Pizzaria
                  </p>
                  <p className="text-sm text-neutral-600">Ponto de partida</p>
                </div>
                <div className="text-xs font-bold text-italian-green bg-italian-green/10 px-3 py-1 rounded-full flex-shrink-0">
                  INÍCIO
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-neutral-300 rounded"></div>
              </div>

              {sortedStops.map((stop, index) => (
                <div key={stop.id}>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-neutral-200 hover:shadow-soft transition-shadow">
                    <div className="w-10 h-10 bg-italian-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5">
                      {stop.ordem}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-neutral-800 text-base">
                            Pedido #{stop.pedido.crmPedidoId}
                          </p>
                          <span className="text-xs font-bold text-italian-red bg-italian-red/10 px-2 py-1 rounded-full flex-shrink-0">
                            PARADA {stop.ordem}
                          </span>
                        </div>
                        {stop.pedido.nomeCliente && (
                          <p className="text-sm text-neutral-600">
                            {stop.pedido.nomeCliente}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <EnvironmentOutlined className="text-neutral-400 text-sm mt-1 flex-shrink-0" />
                          <span className="text-sm text-neutral-600 break-words leading-relaxed">
                            {stop.pedido.enderecoCompleto}
                          </span>
                        </div>

                        {stop.pedido.tempoMaximoEntrega && (
                          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                            <ClockCircleOutlined className="text-orange-500 flex-shrink-0" />
                            <span className="text-sm text-orange-600 font-medium">
                              Entregar até:{" "}
                              {new Date(
                                stop.pedido.tempoMaximoEntrega
                              ).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {index < sortedStops.length - 1 && (
                    <div className="flex justify-center">
                      <div className="w-0.5 h-4 bg-neutral-300 rounded"></div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-neutral-300 rounded"></div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-italian-green/5 rounded-xl border border-italian-green/20">
                <div className="w-10 h-10 bg-italian-green rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  🏠
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-800">
                    Retorno à Pizzaria
                  </p>
                  <p className="text-sm text-neutral-600">Fim da corrida</p>
                </div>
                <div className="text-xs font-bold text-italian-green bg-italian-green/10 px-3 py-1 rounded-full flex-shrink-0">
                  FIM
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="primary"
              size="large"
              onClick={onClose}
              className="bg-italian-green hover:bg-italian-green/90 border-italian-green hover:border-italian-green/90 px-8 h-12 text-base font-semibold w-full sm:w-auto"
            >
              Entendi, obrigado!
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
