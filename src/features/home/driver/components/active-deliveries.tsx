import type React from "react";
import { useState } from "react";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  HeatMapOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { StatusCorrida, type Run } from "../types/run";
import { StatusParada, type Stop } from "../types/stop";

interface ActiveDeliveriesProps {
  runs: Run[];
  loading: boolean;
  onCompleteStop: (runId: number, stopId: number) => void;
}

export const ActiveDeliveries: React.FC<ActiveDeliveriesProps> = ({
  runs,
  loading,
  onCompleteStop,
}) => {
  const [expandedRun, setExpandedRun] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg sm:rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 animate-pulse"
          >
            <div className="h-5 sm:h-6 bg-neutral-200 rounded w-1/3 mb-3 sm:mb-4" />
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 sm:h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-soft border border-neutral-200 p-6 sm:p-8 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <CheckCircleOutlined className="text-neutral-400 text-2xl sm:text-3xl" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-neutral-800 mb-2">
          Nenhuma entrega ativa
        </h3>
        <p className="text-sm sm:text-base text-neutral-500">
          Você não possui entregas pendentes no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {runs.map((run) => (
        <div
          key={run.id}
          className="bg-white rounded-lg sm:rounded-xl shadow-soft border border-neutral-200 overflow-hidden"
        >
          <div
            className="p-4 sm:p-6 cursor-pointer hover:bg-neutral-50 transition-colors active:bg-neutral-100"
            onClick={() =>
              setExpandedRun(expandedRun === run.id ? null : run.id)
            }
          >
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-italian-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <PlayCircleOutlined className="text-italian-green text-sm sm:text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-800 text-sm sm:text-base truncate">
                      Corrida #{run.id}
                    </h3>
                    <div className="sm:hidden">
                      {expandedRun === run.id ? (
                        <UpOutlined className="text-neutral-400 text-xs" />
                      ) : (
                        <DownOutlined className="text-neutral-400 text-xs" />
                      )}
                    </div>
                  </div>
                  <p className="text-neutral-500 text-xs sm:text-sm">
                    <span className="inline sm:hidden">
                      {run.paradas.length} paradas
                    </span>
                    <span className="hidden sm:inline">
                      {run.paradas.length} paradas • Iniciada às{" "}
                      {new Date(run.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                  <p className="text-neutral-500 text-xs sm:hidden mt-1">
                    Iniciada às{" "}
                    {new Date(run.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div
                  className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    run.status === StatusCorrida.EM_ANDAMENTO
                      ? "bg-italian-green/10 text-italian-green"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full" />
                  <span className="hidden sm:inline">
                    {run.status === StatusCorrida.EM_ANDAMENTO
                      ? "Em andamento"
                      : "Finalizada"}
                  </span>
                  <span className="sm:hidden">
                    {run.status === StatusCorrida.EM_ANDAMENTO
                      ? "Ativo"
                      : "Fim"}
                  </span>
                </div>
                <div className="hidden sm:block">
                  {expandedRun === run.id ? (
                    <UpOutlined className="text-neutral-400 text-sm" />
                  ) : (
                    <DownOutlined className="text-neutral-400 text-sm" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-600 mb-2">
                <span className="font-medium">Progresso</span>
                <span className="font-semibold">
                  {
                    run.paradas.filter(
                      (stop) => stop.status === StatusParada.CONCLUIDA
                    ).length
                  }{" "}
                  de {run.paradas.length}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 sm:h-2.5">
                <div
                  className="bg-italian-green h-2 sm:h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (run.paradas.filter(
                        (stop) => stop.status === StatusParada.CONCLUIDA
                      ).length /
                        run.paradas.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {expandedRun === run.id && (
            <div className="border-t border-neutral-200">
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {run.paradas
                  .sort((a, b) => a.ordem - b.ordem)
                  .map((stop, index) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      index={index}
                      onComplete={() => onCompleteStop(run.id, stop.id)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const openNavigation = (
  address: string,
  latitude?: number,
  longitude?: number
) => {
  let url = "";

  if (latitude && longitude) {
    url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
  } else {
    const encodedAddress = encodeURIComponent(address);
    url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
  }

  window.open(url, "_blank");
};

const StopCard: React.FC<{
  stop: Stop;
  index: number;
  onComplete: () => void;
}> = ({ stop, index, onComplete }) => {
  const isCompleted = stop.status === StatusParada.CONCLUIDA;
  const isActive = stop.status === StatusParada.PENDENTE;

  return (
    <div
      className={`p-3 sm:p-4 rounded-lg border transition-all ${
        isCompleted
          ? "border-green-200 bg-green-50"
          : isActive
          ? "border-italian-green bg-italian-green/5"
          : "border-neutral-200 bg-neutral-50"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
            isCompleted
              ? "bg-green-500 text-white"
              : isActive
              ? "bg-italian-green text-white"
              : "bg-neutral-300 text-neutral-600"
          }`}
        >
          {isCompleted ? (
            <CheckCircleOutlined className="text-xs sm:text-sm" />
          ) : (
            index + 1
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
            <h4 className="font-medium text-neutral-800 text-sm sm:text-base truncate">
              Pedido #{stop.pedido.crmPedidoId}
            </h4>
            <span
              className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${
                isCompleted
                  ? "bg-green-100 text-green-700"
                  : isActive
                  ? "bg-italian-green/10 text-italian-green"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {isCompleted ? "Entregue" : isActive ? "Ativo" : "Pendente"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600">
              <EnvironmentOutlined className="text-xs flex-shrink-0 mt-0.5" />
              <span className="break-words leading-relaxed">
                {stop.pedido.enderecoCompleto}
              </span>
            </div>

            {stop.pedido.tempoMaximoEntrega && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
                <ClockCircleOutlined className="text-xs flex-shrink-0" />
                <span>
                  Entregar até:{" "}
                  {new Date(stop.pedido.tempoMaximoEntrega).toLocaleTimeString(
                    "pt-BR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
            )}

            {stop.horarioConclusao && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600">
                <CheckCircleOutlined className="text-xs flex-shrink-0" />
                <span>
                  Entregue às:{" "}
                  {new Date(stop.horarioConclusao).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          {!isCompleted && (
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <button
                onClick={onComplete}
                className="bg-italian-green hover:bg-italian-green/90 active:bg-italian-green/80 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none"
              >
                <span className="sm:hidden">Concluir</span>
                <span className="hidden sm:inline">Marcar como entregue</span>
              </button>
              <button
                onClick={() =>
                  openNavigation(
                    stop.pedido.enderecoCompleto,
                    stop.pedido.latitude,
                    stop.pedido.longitude
                  )
                }
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <HeatMapOutlined className="text-xs sm:text-sm" />
                <span>Navegar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
